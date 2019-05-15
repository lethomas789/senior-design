import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import About from "./components/About/About";
import Signup from "./components/Signup/Signup";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import ButtonAppBar from "./components/ButtonAppBar/ButtonAppBar";
import Shop from "./components/Shop/Shop";
import Cart from "./components/Cart/Cart";
import VendorView from "./components/VendorView/VendorView";
import VendorSignup from "./components/VendorSignup/VendorSignup";
import EditClubInfo from "./components/EditClubInfo/EditClubInfo";
import AddProduct from "./components/AddProduct/AddProduct";
import OrderHistory from "./components/OrderHistory/OrderHistory";
import ShopItemDetailed from "./components/ShopItemDetailed/ShopItemDetailed";
import EditItemView from "./components/EditItemView/EditItemView";
import Footer from "./components/Footer/Footer";
import AccountInfo from "./components/AccountInfo/AccountInfo";
import RecoverPassword from "./components/RecoverPassword/RecoverPassword";
import InputRecoveryPassword from "./components/InputRecoveryPassword/InputRecoveryPassword";
import CartView from "./components/CartView/CartView";
import EmailConfirmation from "./components/EmailConfirmation/EmailConfirmation";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import SuccessfulPayment from './components/SuccesfulPayment/SuccessfulPayment';
import { connect } from "react-redux";
import actions from "./store/actions";
import axios from 'axios';

import { createBrowserHistory } from "history";
import AboutClub from "./components/AboutClub/AboutClub";
import Clubs from "./components/Clubs/Clubs";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import GenericPage from './components/GenericPage/GenericPage'

require("dotenv").config();

const history = createBrowserHistory();

/*
axios.interceptors.request.use(config => {
  // const token 
  if (token != null) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, err => {
  return Promise.reject(err);
})
*/

class App extends Component {
  notificationDOMRef = React.createRef();

  addNotification = ({
    title = "Error",
    message = "Sorry, an error occured.",
    type = "danger",
    duration = 2500
  }) => {
    this.notificationDOMRef.current.addNotification({
      title: title,
      message: message,
      type: type,
      insert: "top",
      container: "bottom-left",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: duration },
      dismissable: { click: true }
    });
  };

  //check token expiration if user was logged in
  checkIfTokenNeedsRefresh = () => {
    if(this.props.login === true){
      const apiURL = "/api/checkTokenRefresh";

      axios.get(apiURL, {
        withCredentials: true
      })
      .then(res => {

      })
      //err catches 403 forbidden error
      .catch(err => {
        //logout user and then display error message
        this.addNotification({
          title: "Error",
          message:  "Token Expired Please Login Again",
          type:  "danger",
        });

        this.props.updateLogout();

        //goal is to show alert message and then redirect
        //set timeout, after 4 seconds redirect to login
        setTimeout(() => {
           window.location = "/login";
        }, 4000);

      })
    }
  }

  componentDidMount() {
    // alert("testing to see if token needs to be refreshed");
    //need to write function to check if token is present, verify on backend, need to see if needs to be refreshed
    //if token is expired, logout user and redirect to login
    this.checkIfTokenNeedsRefresh();
  }
  
  render() {

    return (
      <Router>
        <ScrollToTop>
          <div>
            <ButtonAppBar notifier={this.addNotification} />
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            
            <Route
              exact
              path="/shop"
              render={props => (
                <Shop {...props} notifier={this.addNotification} />
              )}
            />
            
            <Route
              exact
              path="/signup"
              render={() => <Signup notifier={this.addNotification} />}
            />

            <Route
              exact
              path="/login"
              render={props => (
                <Login {...props} notifier={this.addNotification} />
              )}
            />

            <Route
              exact
              path="/cart"
              render={props => (
                <CartView {...props} notifier={this.addNotification} />
              )}
            />

            <Route 
              path="/vendorProducts/:vid" 
              render={props => (
                <VendorView {...props} notifier={this.addNotification} />
              )}
            />

            <Route
              exact
              path="/abcdefg/vendorSignup"
              render={props => (
                <VendorSignup {...props} notifier={this.addNotification} />
              )}
            />

            <Route
              exact
              path="/editClubInfo"
              render={props => (
                <EditClubInfo {...props} notifier={this.addNotification} />
              )}
            />

            <Route
              exact
              path="/addProduct"
              render={props => (
                <AddProduct {...props} notifier={this.addNotification} />
              )}
            />

            <Route
              exact
              path="/orderHistory"
              render={props => (
                <OrderHistory {...props} notifier={this.addNotification} />
              )}
            />

            <Route
              path="/itemDetails/:vid/:pid"
              render={props => (
                <ShopItemDetailed {...props} notifier={this.addNotification} />
              )}
            />

            <Route 
              path="/aboutClub/:vid" 
              render={props => (
                <AboutClub {...props} notifier={this.addNotification} />
              )}
            />

            <Route
              path="/editItem"
              render={props => (
                <EditItemView {...props} notifier={this.addNotification} />
              )}
            />

            <Route 
              exact 
              path="/clubs" 
              render = {props => (
                <Clubs {...props} notifier = {this.addNotification}/>
              )}
            />

            <Route 
              exact 
              path="/accountInfo" 
              render = {props => (
                <AccountInfo {...props} notifier = {this.addNotification}/>
              )}
            />

            <Route
              exact
              path="/recoverPassword"
              render={props => (
                <RecoverPassword {...props} notifier={this.addNotification} />
              )}
            />

            <Route
              path="/inputNewPassword"
              render={props => (
                <InputRecoveryPassword
                  {...props}
                  notifier={this.addNotification}
                />
              )}
            />

            <Route
              path="/emailConfirmation/:token"
              render={props => (
                <EmailConfirmation {...props} notifier={this.addNotification} />
              )}
            />

            <Route
              path="/page"
              render={props => (
                <GenericPage
                  {...props}
                  notifier={this.addNotification}
                />
              )}
            />

            <Route
              exact 
              path="/successfulPayment"
              render={props => (
                <GenericPage
                  {...props}
                  notifier={this.addNotification}
                  pageText={"Thanks for purchasing. Please check your e-mail inbox for an order receipt."}
                />
              )}
            />
            
            {/* <Route exact path="/successfulPayment" component = {SuccessfulPayment}/> */}

            <Footer />
            <ReactNotification ref={this.notificationDOMRef} />
          </div>
        </ScrollToTop>
      </Router>
    );
  }
}

//obtain state from store as props for component
//get cart items, login value, and user email
const mapStateToProps = state => {
  return {
    login: state.auth.login
  };
};

//dispatch action to reducer
const mapDispatchToProps = dispatch => {
  return {
    //update store that user logged out
    updateLogout: () =>
      dispatch({
        type: actions.LOGGED_OUT
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
