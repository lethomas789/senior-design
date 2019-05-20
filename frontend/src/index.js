import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
//import redux
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
//store redux state
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { PersistGate } from 'redux-persist/lib/integration/react';
//redux reducers
import loginReducer from './store/loginReducer';
import getProductsReducer from './store/getProductsReducer';
import cartReducer from './store/cartReducer';
import vendorReducer from './store/vendorReducer';
import shopItemReducer from './store/shopItemReducer';

// import 'typeface-roboto';



//create store for redux state management
//store stores state of application
const rootReducer = combineReducers({
  auth: loginReducer,
  getAllItems: getProductsReducer,
  cart: cartReducer,
  vendor: vendorReducer,
  selectedItem: shopItemReducer
});

//redux persistConfig
const persistConfig = {
  key: 'root',
  storage: storage,
  stateReconciler: autoMergeLevel2
};

const pReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(pReducer);
const persistor = persistStore(store);
const primary = "#6F8AB7";

//Provider tag allows all components to have access to store
ReactDOM.render(<Provider store = {store}> 
                  <PersistGate loading ={null} persistor = {persistor}>
                    <App/> 
                  </PersistGate>
                </Provider>, document.getElementById('root'));

// hot module reloading used to reload app in browser w/out performing a page
// refresh. Useful when wanting to test w/out losing console.log() s
if (module.hot) {
  module.hot.accept()
}

serviceWorker.unregister();
