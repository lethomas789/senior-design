import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import queryString from "query-string";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import "./InputRecoveryPassword.css";

class InputRecoveryPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: ""
    };
  }

  componentDidMount() {
    //check token from query param in url

    //extract query string param for token
    var queryParseParams = queryString.parse(this.props.location.search);

    console.log(queryParseParams);
    var token = queryParseParams.token;

    const apiURL = "/api/resetPass/checkToken";
    axios
      .get(apiURL, {
        params: {
          resetPassToken: token
        }
      })
      .then(res => {
        //get email from matching token in database
        if (res.data.success === true) {
          this.setState({
            email: res.data.email
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

  //check reset token
  updatePassword = () => {
    console.log("updating password");
    //input checks for matching passwords and min/max length
    if (this.state.password !== this.state.confirmPassword) {
      this.props.notifier({
        title: "Warning",
        message: "Passwords do not match.",
        type: "warning"
      });
      return;
    } else if (
      this.state.password.length < 8 ||
      this.state.password.length > 20
    ) {
      this.props.notifier({
        title: "Warning",
        message:
          "Minimum password length is 8 characters and max length is 20 characters.",
        type: "warning"
      });
      return;
    }

    //check token from query param in url
    //after getting email from database and user inputs new password, update new password
    axios
      .post("/api/resetPass/updatePass", {
        params: {
          email: this.state.email,
          newPassword: this.state.password
        }
      })
      .then(res => {
        if (res.data.success === true) {
          this.props.notifier({
            title: "Success",
            message: res.data.message.toString(),
            type: "success"
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

  //change password on input
  handlePasswordField = event => {
    this.setState({
      password: event.target.value
    });
  };

  //change confirm password on input change
  handleConfirmPasswordField = event => {
    this.setState({
      confirmPassword: event.target.value
    });
  };

  render() {
    return (
      <div id="new-password-container">
        <Paper className="password-paper-container">
          <h2> Password Recovery </h2>
          <h3> Enter your new password: </h3>
          <form>
            <TextField
              label="Password"
              required="true"
              onChange={this.handlePasswordField}
              type = "password"
              style={{ marginBottom: "20px" }}
            />
          </form>

          <form>
            <TextField
              label="Confirm Password"
              required="true"
              type = "password"
              onChange={this.handleConfirmPasswordField}
              style={{ marginBottom: "20px" }}
            />
          </form>

          <Button
            variant="contained"
            color="primary"
            onClick={this.updatePassword}
          >
            Change Password
          </Button>
        </Paper>
      </div>
    );
  }
}

export default InputRecoveryPassword;
