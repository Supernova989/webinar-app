import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, createStore, compose } from 'redux';

const middleware = [];
middleware.push(thunkMiddleware);

const composeEnhancers =
	typeof window === 'object' && 'production' !== process.env.NODE_ENV &&
	window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

if (process.env.NODE_ENV === 'development') {
	console.log('Development mode! Redux Logger is turned ON');
}

const enhancer = composeEnhancers(applyMiddleware(...middleware));

const store = createStore(rootReducer, enhancer);

export default store;
