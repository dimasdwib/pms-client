import App from './App';
import React from 'react';
import { Provider } from 'react-redux';
import { Capture } from 'react-loadable';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import { getBundles } from 'react-loadable/webpack';
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import configureStore from './configureStore';
import stats from '../build/react-loadable.json';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const context = {};
    const modules = [];
    const preloadedState = { 
            Runtime: { initial: 'Test Server Reducer' } 
          };
    const store = configureStore(preloadedState);
    const markup = renderToString(
      <Capture report={moduleName => modules.push(moduleName)}>
        <StaticRouter context={context} location={req.url}>
          <Provider store={store}>
            <App />
          </Provider>
        </StaticRouter>
      </Capture>
    );
    
    const finalState = store.getState();

    if (context.url) {
      res.redirect(context.url);
    } else {
      const bundles = getBundles(stats, modules);
      const chunks = bundles.filter(bundle => bundle.file.endsWith('.js'));
      const styles = bundles.filter(bundle => bundle.file.endsWith('.css'));
      
      res.status(200).send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Property Management System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ''
        }
        ${styles
          .map(style => {
            return `<link href="${style.file}" rel="stylesheet"/>`;
          })
          .join('\n')}
        <style type="text/css">
          .printonly {
            display: none; 
          }
          @media print {
              aside, header, header *, footer, .ant-list, .noprint { 
                display: none !important;
              }
              #printarea {
                padding: 0;
                margin: 0;
                position: fixed !important;
                left: 0 !important;
                top: 0 !important;
                width: 100%;
                height: 100%;
                overflow: hidden;
                z-index: 99999;
              }
              .printonly {
                display: block;
              }
              #root #printarea {
                visibility: visible !important;
                background-color: #fff;
              }
              #printarea h1 {
                font-weight: 600;
                font-size: 1.4em; 
              }
          }
        </style>
    </head>
    <body>
        <div id="root">${markup}</div>
        <script>
          window.__PRELOADED_STATE__ = ${serialize(finalState)}
        </script>
        ${
          process.env.NODE_ENV === 'production'
            ? `<script src="${assets.client.js}"></script>`
            : `<script src="${assets.client.js}" crossorigin></script>`
        }
        ${chunks
          .map(
            chunk =>
              process.env.NODE_ENV === 'production'
                ? `<script src="/${chunk.file}"></script>`
                : `<script src="http://${process.env.HOST}:${parseInt(
                    process.env.PORT,
                    10
                  ) + 1}/${chunk.file}"></script>`
          )
          .join('\n')}
        <script>window.main();</script>
    </body>
</html>`
      );
    }
  });

export default server;
