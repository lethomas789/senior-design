import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import './App.css';
import About from './components/About/About';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import ButtonAppBar from './components/ButtonAppBar/ButtonAppBar';
import Shop from './components/Shop/Shop';
import Cart from './components/Cart/Cart';
import VendorView from './components/VendorView/VendorView';
import VendorSignup from './components/VendorSignup/VendorSignup';
import EditClubInfo from './components/EditClubInfo/EditClubInfo';
import AddProduct from './components/AddProduct/AddProduct';
import OrderHistory from './components/OrderHistory/OrderHistory';
import ShopItemDetailed from './components/ShopItemDetailed/ShopItemDetailed';


import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <ButtonAppBar />
          <Route exact path = "/" component = {Home} />
          <Route exact path = "/about" component = {About} />
          <Route exact path = "/shop" component = {Shop}/>
          <Route exact path = "/signup" component = {Signup} />
          <Route exact path = "/login" component = {Login} /> 
          <Route exact path = "/cart" component = {Cart}/>
          <Route exact path = "/vendorProducts" component = {VendorView}/>
          <Route exact path = "/abcdefg/vendorSignup" component = {VendorSignup}/>
          <Route exact path = "/editClubInfo" component = {EditClubInfo}/>
          <Route exact path = "/addProduct" component = {AddProduct}/>
          <Route exact path = "/orderHistory" component = {OrderHistory}/>
          <Route path = "/itemDetails/:vid/:pid" component = {ShopItemDetailed}/>
        </div>
      </Router>
    );
  }
}

export default App;
