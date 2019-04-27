import React, { Component } from "react";
import "./RecoverPassword.css";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

class RecoverPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: ""
    };
  }

  //function to handle email change on input
  handleEmailField = event => {
    this.setState({
      email: event.target.value
    });
  };

  //function called when clicking recover password
  sendRecoverEmail = () => {
    //get request to send email with password
    const apiURL = "/api/resetPass";
    console.log("this is the input of the user's email", this.state.email);
    this.props.notifier({
      title: "Success",
      message:
        "A password reset link has been sent to your email. Please check your inbox.",
      type: "success"
    });
    axios
      .post(apiURL, {
        params: {
          email: this.state.email
        }
      })
      .then(res => {
        console.log(res.data);
        if (res.data.success === true) {
          this.props.notifier({
            title: "Success",
            message: res.data.message,
            type: "success"
          });
        } else {
          // alert("no password for user that signed in with google");
          // TODO UPDATE BACKEND TO CHECK FOR GMAIL
          this.props.notifier({
            title: "Warning",
            message: "Sorry, no such account for given email.",
            type: "warning"
          });
        }
      })
      .catch(err => {
        this.props.notifier({
          title: "Error",
          message: err,
          type: "danger"
        });
      });
  };

  render() {
    return (
      <div id="enter-email-container">
        <Paper className="password-paper-container">
          <h2> Password Recovery </h2>
          <div>
            Please enter your email, and we will send you a password reset link.
          </div>
          <form>
            <TextField
              label="Email"
              required="true"
              onChange={this.handleEmailField}
            />
          </form>
          <Button
            variant="contained"
            color="primary"
            onClick={this.sendRecoverEmail}
            style={{
              marginTop: "20px"
            }}
          >
            Recover Password
          </Button>
        </Paper>
      </div>
    );
  }
}

export default RecoverPassword;
