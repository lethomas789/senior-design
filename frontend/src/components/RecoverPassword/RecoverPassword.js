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
      confirmPassword: "",
      toRedirect: false,
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
    if (this.state.email === "") {
      this.props.notifier({
        title: "Warning",
        message: "Please enter an email.",
        type: "warning"
      });
      return;
    }
    //get request to send email with password
    const apiURL = "/api/resetPass";
    axios
      .post(apiURL, {
        params: {
          email: this.state.email
        }
      })
      .then(res => {
        if (res.data.success === true) {
          this.props.notifier({
            title: "Success",
            message: res.data.message.toString(),
            type: "success"
          });
          this.props.history.push("/check-email/reset");
        } else {
          this.props.notifier({
            title: "Warning",
            message: res.data.message.toString(),
            type: "warning",
            // duration: 5000  // make the notifier here last longer
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
    return (
      <div id="passwordForm">
      <div id="enter-email-container">
      
        <Paper className="password-paper-container">
          <h2> Password Recovery </h2>
          <div>
            Please enter your email, and we will send you a password reset link.
          </div>
          <form>
            <TextField
              label="Email"
              required={true}
              onChange={this.handleEmailField}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  // bug where pressing enter refreshes the page, so below is
                  // done to force the enter key to call sendRecoverEmail()
                  ev.preventDefault();
                  this.sendRecoverEmail();
                }
              }}
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
      </div>
    );
  }
}

export default RecoverPassword;
