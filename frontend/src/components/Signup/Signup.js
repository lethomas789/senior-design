import React, { Component } from "react";
import GoogleLogin from "react-google-login";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import "./Signup.css";
import { connect } from "react-redux";
import actions from "../../store/actions";
// import Dialog from "@material-ui/core/Dialog";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
// import { DialogActions } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
// import CircularProgress from "@material-ui/core/CircularProgress";
// import coffee from "../../images/coffee.jpg";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2
  }
});

class Signup extends Component {
  constructor(props) {
    super(props);
    //store user input
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      open: false,
      progressValue: 0,
      progressVariant: "determinate",
      responseMessage: "",
      success: false,
      toRedirect: false
    };
    this.sendSignup = this.sendSignup.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  //handle dialog closing
  handleClose() {
    this.setState({
      open: false
    });

    // if (this.state.success === true) {
    //   this.props.history.push("/login");
    // }
  }

  //send signup request
  sendSignup() {
    //load progress circle to wait for signup check
    this.setState({
      progressValue: 50,
      progressVariant: "indeterminate"
    });

    if (this.state.password !== this.state.confirmPassword) {
      this.props.notifier({
        title: "Error",
        message: "Passwords do not match.",
        type: "warning"
      });
    } else {
      const apiURL = "/api/signup";
      //send signup request
      axios
        .post(apiURL, {
          params: {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password
          }
        })
        .then(res => {
          //if signup is successful, display success message
          if (res.data.success === true) {
            this.props.notifier({
              title: "Success",
              message:
                "Signup successful, please check your email to activate your account.",
              type: "success"
            });
            this.setState(() => ({ toRedirect: true }));
            // this.props.history.push('/check-email')
          }

          //display error message
          else {
            this.props.notifier({
              title: "Error",
              message: res.data.message + " Please try again.",
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
  }

  //handle enter key being pressed
  handleEnter(e) {
    var key = e.keyCode;
    if (key === 13) {
      this.sendSignup();
    }
  }

  //get logged in user's cart info
  getCart() {
    const apiURL = "/api/getUserCart";
    axios
      .get(apiURL, {
        withCredentials: true
      })
      .then(res => {
        var amtPurchased = 0;

        for (let i = 0; i < res.data.data.length; i++) {
          amtPurchased = amtPurchased + res.data.data[i].amtPurchased;
        }

        //after getting cart info, update redux store container
        this.props.updateItems(res.data.data);

        //update cart badge based on number of items in user's cart
        this.props.updateAmountPurchased(amtPurchased);

        // switch to shop page
        this.setState(() => ({ toShop: true }));
      })
      .catch(err => {
        this.props.notifier({
          title: "Error",
          message: err.toString(),
          type: "danger"
        });
      });
  }

  //response values after oauth returns with email login and password
  responseGoogle = response => {
    //after getting response from google, proceed with login process of redux state
    //send login parameters to backend
    var email = response.w3.U3;
    var firstName = response.w3.ofa;
    var lastName = response.w3.wea;
    // var lastName = response.w3.wea;

    //update email of user logged in by modifying state
    this.setState({
      email: email
    });

    //make api call to login with gmail
    axios
      .post("/api/login/gmail", {
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

  // //response values after oauth returns with email login and password
  // responseGoogle = response => {
  //   //after getting response from google, proceed with login process of redux state
  //   //send login parameters to backend
  //   var email = response.w3.U3;
  //   var firstName = response.w3.ofa;
  //   var lastName = response.w3.wea;

  //   //update email of user logged in by modifying state
  //   this.setState({
  //     email: email
  //   });

  //   //make api call to login with gmail
  //   axios
  //     .post("/api/signup/googleSignup", {
  //       params: {
  //         email: email,
  //         firstName: firstName,
  //         lastName: lastName
  //       }
  //     })
  //     .then(res => {
  //       //if signup is successful, display success message
  //       if (res.data.success === true) {
  //         this.props.notifier({
  //           title: "Success",
  //           message:
  //             "Signup successful. Please check your email for a confirmation link.",
  //           type: "success",
  //           time: 5000
  //         });
  //         this.setState(() => ({ toRedirect: true }));
  //         // this.props.history.push('/check-email')
  //       }

  //       //display error message
  //       else {
  //         this.props.notifier({
  //           title: "Error",
  //           message: res.data.message + " Please try again.",
  //           type: "warning",
  //           time: 5000
  //         });
  //       }
  //     })
  //     .catch(err => {
  //       this.props.notifier({
  //         title: "Error",
  //         message: err.toString(),
  //         type: "danger",
  //         time: 5000,
  //       });
  //     });
  // };

  render() {
    // const { classes } = this.props;
    if (this.state.toRedirect === true) {
      return <Redirect to="/check-email" />;
    }

    return (
      <div id="signupContainer">
        <div id="signupForms">
          <Paper className="signupPaperContainer">
            <h1> Sign Up </h1>
            <div className="textFormm" id="row">
              <TextField
                label="First Name"
                required="true"
                onChange={event =>
                  this.setState({ firstName: event.target.value })
                }
                onKeyDown={this.handleEnter}
              />
            </div>
            <div className="textFormm" id="row">
              <TextField
                label="Last Name"
                required="true"
                onChange={event =>
                  this.setState({ lastName: event.target.value })
                }
                onKeyDown={this.handleEnter}
              />
            </div>
            <div className="textFormm" id="row">
              <TextField
                label="Email"
                required="true"
                onChange={event => this.setState({ email: event.target.value })}
                onKeyDown={this.handleEnter}
              />
            </div>
            <div className="textFormm" id="row">
              <TextField
                type="password"
                label="Password"
                required="true"
                onChange={event =>
                  this.setState({ password: event.target.value })
                }
                onKeyDown={this.handleEnter}
              />
            </div>
            <div className="textFormm" id="row">
              <TextField
                type="password"
                label="Confirm Password"
                required="true"
                onChange={event =>
                  this.setState({ confirmPassword: event.target.value })
                }
                onKeyDown={this.handleEnter}
              />
            </div>
            <div className="pushDown">
              <Button
                variant="contained"
                color="primary"
                onClick={this.sendSignup}
                style={{
                  backgroundColor: "#DAAA00",
                  color: "white",
                  boxShadow: "none",
                  fonFamily: "Proxima Nova",
                  marginBottom: "15px"
                }}
              >
                Sign Up
              </Button>
            </div>

            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_ID}
              buttonText="Login in with Google"
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
              cookiePolicy={"single_host_origin"}
            />
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
    login: state.auth.login
  };
};

//redux, dispatch action to reducer to update state
const mapDispatchToProps = dispatch => {
  return {
    //update logged in values
    updateLogin: () =>
      dispatch({
        type: actions.LOGGED_IN
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
        currentVendor: vendor
      }),

    updateAmountPurchased: amount =>
      dispatch({
        type: actions.UPDATE_AMOUNT_PURCHASED,
        amountPurchased: amount
      })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Signup));
