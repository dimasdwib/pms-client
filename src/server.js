import App from './App';
import React from 'react';
import { Provider } from 'react-redux';
import { Capture } from 'react-loadable';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import expressStaticGzip from "express-static-gzip";
import { getBundles } from 'react-loadable/webpack';
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import configureStore from './configureStore';
import stats from '../build/react-loadable.json';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server
  .disable('x-powered-by')
  .use('/', expressStaticGzip(process.env.RAZZLE_PUBLIC_DIR, {
      enableBrotli: true,
      customCompressions: [{
        encodingName: 'gzip',
        fileExtension: 'gzip'
      }],
      orderPreference: ['br', 'gz', 'gzip'],
      setHeaders: (res) => {
        res.setHeader("Cache-Control", "public, max-age=31536000");
      }
    })
  )
  // .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
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
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" type="text/css" href="${assets.client.css}">`
            : ''
        }
        ${styles
          .map(style => {
            return `<link href="${style.file}" type="text/css" rel="stylesheet"/>`;
          })
          .join('\n')}
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
