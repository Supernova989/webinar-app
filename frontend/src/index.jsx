import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import App from './App';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import store from './store';
import * as serviceWorker from './serviceWorker';

const output = <Provider store={store}><Router basename='/'><App/></Router></Provider>;
let mountNode = 'appMountPoint';

if (document.getElementById(mountNode)) {
	ReactDOM.render(output, document.getElementById(mountNode));
}


serviceWorker.unregister();
