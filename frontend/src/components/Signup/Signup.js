import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './Signup.css';

export default class Signup extends Component {
  constructor(props) {
    super(props)
    //store user input
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
    this.sendSignup = this.sendSignup.bind(this);
  }

  //send signup request
  sendSignup(){
    const apiURL = "/api/signup";
    axios.post(apiURL, {
      params: {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password
      }
    })
    .then(res => {
      if(res.data.success === true){
        alert(res.data.message);
      }

      else{
        alert(res.data.message);
      }
    })
    .catch(err => {
      alert(err);
    })
  }
  
  render() {
    return (
      <div id = "signupContainer">
        <div id = "signupForms">
          <h1> Sign Up </h1>
          <div id="row">
            <TextField
              label="First Name"
              required="true"
              onChange={(event) => this.setState({ firstName: event.target.value })}
            />
          </div>
          <div id="row">
            <TextField
              label="Last Name"
              required="true"
              onChange={(event) => this.setState({ lastName: event.target.value })}
            />
          </div>
          <div id="row">
            <TextField
              label="Email"
              required="true"
              onChange={(event) => this.setState({ email: event.target.value })}
            />
          </div>
          <div id="row">
            <TextField
              type="password"
              label="Password"
              required="true"
              onChange={(event) => this.setState({ password: event.target.value })}
            />
          </div>
          <Button id = "signupButton" onClick = {this.sendSignup}> Sign Up  </Button>
        </div>
      </div>
    )
  }
}
