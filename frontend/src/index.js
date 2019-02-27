import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import loginReducer from './store/loginReducer';
import getProductsReducer from './store/getProductsReducer';
import cartReducer from './store/cartReducer';
import vendorReducer from './store/vendorReducer';

//create store for redux state management
//store stores state of application
const rootReducer = combineReducers({
  auth: loginReducer,
  getAllItems: getProductsReducer,
  cart: cartReducer,
  vendor: vendorReducer
});

const store = createStore(rootReducer);

//Provider tag allows all components to have access to store
ReactDOM.render(<Provider store = {store}> <App /> </Provider>, document.getElementById('root'));

// hot module reloading used to reload app in browser w/out performing a page
// refresh. Useful when wanting to test w/out losing console.log() s
if (module.hot) {
  module.hot.accept()
}

serviceWorker.unregister();
