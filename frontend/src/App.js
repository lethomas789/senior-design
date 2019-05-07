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

import { createBrowserHistory } from "history";
import AboutClub from "./components/AboutClub/AboutClub";
import Clubs from "./components/Clubs/Clubs";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

require("dotenv").config();

const history = createBrowserHistory();

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

  render() {
    return (
      <Router>
        <ScrollToTop>
          <div>
            <ButtonAppBar notifier={this.addNotification} />
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route exact path="/shop" component={Shop} />
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
            <Route path="/vendorProducts/:vid" component={VendorView} />
            <Route
              exact
              path="/abcdefg/vendorSignup"
              component={VendorSignup}
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

            <Route path="/aboutClub/:vid" component={AboutClub} />
            <Route exact path="/editItem" component={EditItemView} />
            <Route exact path="/clubs" component={Clubs} />
            <Route exact path="/accountInfo" component={AccountInfo} />

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
            <Footer />
            <ReactNotification ref={this.notificationDOMRef} />
          </div>
        </ScrollToTop>
      </Router>
    );
  }
}

export default App;
