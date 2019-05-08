import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import "./EmailConfirmation.css";
import Paper from "@material-ui/core/Paper";

export default class EmailConfirmation extends Component {
  state = {
    isConfirmed: false,
    toLogin: false,
    errorMessage: ""
  };

  componentDidMount() {
    // check link, call route
    const { token } = this.props.match.params;
    const apiURL = "/api/signup/confirmEmail";
    axios
      .get(apiURL, { params: { token } })
      .then(res => {
        if (res.data.success === true) {
          this.setState(() => ({ isConfirmed: true }));
          setTimeout(() => {
            this.setState(() => ({ toLogin: true }));
          }, 5000);
        } else {
          this.setState(() => ({ errorMessage: res.data.message }));
        }
      })
      .catch(err => {
        console.log("Error in email confirmation:", err);
        this.props.notifier({
          title: "Error",
          message: err.toString(),
          type: "warning"
        });
      });
  }

  render() {
    if (!this.state.isConfirmed) {
      return (
        <div id="email-confirmation-container">
          <Paper id="email-confirmation-paper-container">
            <h4>
              {this.state.errorMessage !== ""
                ? this.state.errorMessage
                : "Sorry, there was an error in confirming your email."}
            </h4>
          </Paper>
        </div>
      );
    } else if (this.state.toLogin) {
      return <Redirect to="/login" />;
    }

    return (
      <div id="email-confirmation-container">
        <Paper id="email-confirmation-paper-container">
          <h4>
            Email confirmed. Thanks for signing up! Redirecting to login ...
          </h4>
        </Paper>
      </div>
    );
  }
}
