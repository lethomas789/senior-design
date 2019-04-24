import React, { Component } from "react";
import { BrowserRouter as Router, Route, withRouter } from "react-router-dom";
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

import { createBrowserHistory } from "history";
import AboutClub from "./components/AboutClub/AboutClub";
import Clubs from "./components/Clubs/Clubs";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

import ScrollToTop from './ScrollToTop';

const history = createBrowserHistory();


class App extends Component {
  notificationDOMRef = React.createRef();

  addNotification = ({ title, message, type }) => {
    this.notificationDOMRef.current.addNotification({
      title: title,
      message: message,
      type: type,
      insert: "top",
      container: "bottom-left",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 3000 },
      dismissable: { click: true }
    });
  };

  render() {
    return (
      <Router>
        <ScrollToTop>
          <div>
          <ButtonAppBar notifier={this.addNotification}/>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/shop" component={Shop} />
          {/* <Route exact path = "/signup" component = {Signup} /> */}
          <Route
            exact
            path="/signup"
            render={() => <Signup notifier={this.addNotification} />}
          />

          {/* <Route exact path = "/login" component = {Login} />  */}
          <Route
            exact
            path="/login"
            render={() => <Login notifier={this.addNotification} />}
          />

          <Route exact path="/cart" component={Cart} />
          <Route path="/vendorProducts/:vid" component={VendorView} />
          <Route exact path="/abcdefg/vendorSignup" component={VendorSignup} />
          <Route exact path="/editClubInfo" component={EditClubInfo} />
          <Route exact path="/addProduct" component={AddProduct} />
          <Route exact path="/orderHistory" component={OrderHistory} />
          {/* <Route path = "/itemDetails/:vid/:pid" component = {ShopItemDetailed}/> */}
          <Route
            path="/itemDetails/:vid/:pid"
            render={props => (
              <ShopItemDetailed {...props} notifier={this.addNotification} />
            )}
          />

          <Route path="/aboutClub/:vid" component={AboutClub} />
          <Route exact path="/editItem" component={EditItemView} />
          <Route exact path="/clubs" component={Clubs} />
          <Footer />
          <ReactNotification ref={this.notificationDOMRef} />
          </div>
          </ScrollToTop>
      </Router>
    );
  }
}

export default App;
