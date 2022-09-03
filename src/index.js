import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app';

import TimeAgo from 'javascript-time-ago'
 
import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'

ReactDOM.render(
  <BrowserRouter>
    <App />
    
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)
