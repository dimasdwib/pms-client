import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './Reducers';

const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    process.env.NODE_ENV === 'development' ?
      composeWithDevTools(
        applyMiddleware(thunk),
      ) : applyMiddleware(thunk),
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./Reducers', () => {
      const nextRootReducer = require('./Reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore;
