import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import ButtonAppBar from './ButtonAppBar';

export default class Signup extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  }
  
  render() {
    return (
      <div>
        <ButtonAppBar />
        <div id="row">
          <TextField
            label="Name"
            required="true"
          />
        </div>
        <div id="row">
          <TextField
            label="Last Name"
            required="true"
          />
        </div>
        <div id="row">
          <TextField
            label="email"
            required="true"
          />
        </div>
        <div id="row">
          <TextField
            label="password"
            required="true"
          />
        </div>
      </div>
    )
  }
}
