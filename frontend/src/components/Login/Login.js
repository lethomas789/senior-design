import React, { Component } from "react";
import GoogleLogin from "react-google-login";
import { connect } from "react-redux";
import actions from "../../store/actions";
import "./Login.css";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
// import Dialog from "@material-ui/core/Dialog";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
// import { DialogActions } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
// import CircularProgress from "@material-ui/core/CircularProgress";
import PropTypes from "prop-types";
// import painting from "../../images/painting.jpg";
import { Link, Redirect } from "react-router-dom";

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2
  }
});

//Login component, allows user to login with email and password credentials
class Login extends Component {
  constructor(props) {
    super(props);
    //store user input
    this.state = {
      email: "",
      password: "",
      open: false,
      progressValue: 0,
      progressVariant: "determinate",
      responseMessage: "",
      toShop: false,
    };
    this.getCart = this.getCart.bind(this);
    this.sendLogin = this.sendLogin.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  //get logged in user's cart info
  getCart() {
    const apiURL = "/api/getUserCart";
    axios
      .get(apiURL, {
        withCredentials: true
      })
      .then(res => {
        //after getting cart info, update redux store container
        this.props.updateItems(res.data.data);

        // switch to shop page
        this.setState(() => ({ toShop: true}));
      })
      .catch(err => {
        this.props.notifier({
          title: "Error",
          message: err.toString(),
          type: "danger"
        });
      });
  }

  //send login request, display if login was successful
  sendLogin() {
    //load progress circle to wait for login check
    this.setState({
      progressValue: 50,
      progressVariant: "indeterminate"
    });
    const apiURL = "/api/login";
    axios
      .post(apiURL, {
        params: {
          email: this.state.email,
          password: this.state.password
        }
      })
      //successful login, display message
      .then(res => {
        //login for regular user, non-admin
        if (res.data.success === true && res.data.isAdmin === false) {
          //dispatch update login action to update login state

          //update redux store with email and jwt
          this.props.updateLogin();

          //after updating login, get cart info
          this.getCart();

          //display dialog for login successful
          this.props.notifier({
            title: "Success",
            message: "Login Successful",
            type: "success"
          });
          this.props.history.push("/shop");
          this.forceUpdate();
        } else if (res.data.success === true && res.data.isAdmin === true) {
          //after determining user is an admin, get object list of user's active vendors

          const vendorURL = "/api/adminUser";
          axios
            .get(vendorURL, {
              withCredentials: true,
            })
            .then(res => {
              let currentVendorID = res.data.vendors[0].vid;
              let currentVendors = res.data.vendors;
              let currentVendorName = res.data.vendors[0].vendorName;

              //update redux store state
              this.props.updateAdminLogin(
                currentVendorID,
                currentVendors,
                currentVendorName
              );

              //after updating login, get cart info
              this.getCart();

              //display dialog for login successful
              this.props.notifier({
                title: "Success",
                message: "Login Successful",
                type: "success"
              });
              this.props.history.push("/shop");
            })
            .catch(err => {
              this.props.notifier({
                title: "Error",
                message: err.toString(),
                type: "danger"
              });
            });
        }
        //display error message with logging in
        else {
          this.props.notifier({
            title: "Warning",
            message: res.data.message,
            type: "warning"
          });
        }
      })
      .catch(err => {
        this.props.notifier({
          title: "Error",
          message: err.toString(),
          type: "danger"
        });
      });
  }

  //handle dialog closing
  handleClose() {
    this.setState({
      open: false
    });

    if (this.props.login === true) {
      this.props.history.push("/shop");
    }
  }

  //handle enter key being pressed
  handleEnter(e) {
    var key = e.keyCode;
    if (key === 13) {
      this.sendLogin();
    }
  }

  //response values after oauth returns with email login and password
  responseGoogle = response => {
    //after getting response from google, proceed with login process of redux state
    //send login parameters to backend
    var email = response.w3.U3;
    var firstName = response.w3.ofa;
    var lastName = response.w3.wea;

    //update email of user logged in by modifying state
    this.setState({
      email: email
    });

    //make api call to login with gmail
    axios
      .post("/api/login/googleLogin", {
        params: {
          email: email,
          firstName: firstName,
          lastName: lastName
        }
      })
      .then(res => {
        console.log(res);
        //check for login success status
        if (res.data.success === true && res.data.isAdmin === false) {
          //dispatch update login action to update login state
          this.props.updateLogin();

          this.props.notifier({
            title: "Success",
            message: "Login Successful",
            type: "success"
          });

          //after updating login, get cart info
          this.getCart();
          this.props.history.push("/shop");

          //display dialog for login successful
        } else if (res.data.success === true && res.data.isAdmin === true) {
          const vendorURL = "/api/adminUser";
          axios
            .get(vendorURL, {
              withCredentials: true
            })
            .then(res => {
              let currentVendorID = res.data.vendors[0].vid;
              let currentVendors = res.data.vendors;
              let currentVendorName = res.data.vendors[0].vendorName;

              //update redux store state
              this.props.updateAdminLogin(
                currentVendorID,
                currentVendors,
                currentVendorName,
              );

              //after updating login, get cart info
              this.getCart();

              //display dialog for login successful
              this.props.notifier({
                title: "Success",
                message: "Login Successful",
                type: "success"
              });
              this.props.history.push("/shop");
            })
            .catch(err => {
              this.props.notifier({
                title: "Error",
                message: err.toString(),
                type: "danger"
              });
            });
        } // end of admin login
        else {
          this.props.notifier({
            title: "Warning",
            message: res.data.message.toString(),
            type: "warning"
          });
        }
      })
      .catch(err => {
        this.props.notifier({
          title: "Error",
          message: err.toString(),
          type: "danger"
        });
      });
  };
  render() {
    const { classes } = this.props;
    if (this.state.toShop === true) {
      return <Redirect to="/shop" />
    }

    // pass props from App js /logout route
    // TODO make it state
    if (this.props.logout === true) {
      console.log('LOGGING OUT USER FROM EXPIRED TOKEN');
      this.props.updateLogout();
      return <Redirect to="/login" />
    }

    return (
      <div id="loginContainer">
        <div id="loginForms">
          <Paper className="paperContainer">
            <h1> Login </h1>
            <div className="testFormm" id="row">
              <TextField
                id="outline-simple-start-adornment"
                label="Email"
                required={true}
                onChange={event => this.setState({ email: event.target.value })}
                onKeyDown={this.handleEnter}
              />
            </div>
            <div className="textFormm" id="row">
              <TextField
                type="password"
                label="Password"
                required={true}
                onChange={event =>
                  this.setState({ password: event.target.value })
                }
                onKeyDown={this.handleEnter}
              />
              <Link to="/recoverPassword">
                <h6> Recover Password </h6>
              </Link>
            </div>

            <div className="pushDown">
              <Button
                variant="contained"
                color="primary"
                onClick={this.sendLogin}
              >
                Login
              </Button>
            </div>

            <div className="pushDown2">
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_ID}
                buttonText="Login with Google"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                cookiePolicy={"single_host_origin"}
              />
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

//obtain state from store as props for component
//get cart items, login value, and user email
const mapStateToProps = state => {
  return {
    items: state.cart.items,
    login: state.auth.login,
    vendors: state.vendor.vendors
  };
};

//redux, dispatch action to reducer to update state
const mapDispatchToProps = dispatch => {
  return {
    //update logged in values
    updateLogin: () =>
      dispatch({
        type: actions.LOGGED_IN,
      }),

    updateLogout: () =>
      dispatch({
        type: actions.LOGGED_OUT
      }),

    //get user's cart from state after logging in
    updateItems: response =>
      dispatch({
        type: actions.GET_CART,
        cart: response
      }),

    //update admin login
    updateAdminLogin: (vendorID, adminsOf, vendor) =>
      dispatch({
        type: actions.ADMIN_LOGGED_IN,
        vid: vendorID,
        admins: adminsOf,
        currentVendor: vendor,
      })
  };
};

Login.propsTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Login));
