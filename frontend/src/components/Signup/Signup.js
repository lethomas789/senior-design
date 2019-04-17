import React, { Component } from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import "./Signup.css";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { DialogActions } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import wine from "../../images/wine.jpg";
import PropTypes from "prop-types";

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
      success: false
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

    if (this.state.success === true) {
      this.props.history.push("/shop");
    }
  }

  //send signup request
  sendSignup() {
    //load progress circle to wait for signup check
    this.setState({
      progressValue: 50,
      progressVariant: "indeterminate"
    });

    if (this.state.password != this.state.confirmPassword) {
      this.setState({
        open: true,
        progressValue: 0,
        progressVariant: "determinate",
        responseMessage: "Passwords do not match!"
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
            this.setState({
              open: true,
              progressValue: 0,
              progressVariant: "determinate",
              responseMessage: "Signup successful! Please login!",
              success: true
            });
          }

          //display error message
          else {
            this.setState({
              open: true,
              progressValue: 0,
              progressVariant: "determinate",
              responseMessage: res.data.message
            });
          }
        })
        .catch(err => {
          alert(err);
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

  render() {
    const { classes } = this.props;
    return (
      <div id="signupContainer">
        <div id="signupForms">
          <Paper className="signupPaperContainer">
            <h1> Sign Up </h1>
            <div className="textForm" id="row">
              <TextField
                label="First Name"
                required="true"
                onChange={event =>
                  this.setState({ firstName: event.target.value })
                }
                onKeyDown={this.handleEnter}
              />
            </div>
            <div className="textForm" id="row">
              <TextField
                label="Last Name"
                required="true"
                onChange={event =>
                  this.setState({ lastName: event.target.value })
                }
                onKeyDown={this.handleEnter}
              />
            </div>
            <div className="textForm" id="row">
              <TextField
                label="Email"
                required="true"
                onChange={event => this.setState({ email: event.target.value })}
                onKeyDown={this.handleEnter}
              />
            </div>
            <div className="textForm" id="row">
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
            <div className="textForm" id="row">
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
              >
                {" "}
                Sign Up{" "}
              </Button>
            </div>
          </Paper>

          <div className="progressContainer">
            <div className="circle">
              <CircularProgress
                className="loadingCircle"
                size={80}
                variant={this.state.progressVariant}
                value={this.state.progressValue}
                className={classes.progress}
              />
            </div>
          </div>

          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {this.state.responseMessage}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        </div>
      </div>
    );
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Signup);
