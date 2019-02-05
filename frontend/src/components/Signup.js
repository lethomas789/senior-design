import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';

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
        <div id="row">
          <TextField
            label="Name"
            required="true"
            onChange={(event, newValue) => this.setState({ firstName: newValue })}
          />
        </div>
        <div id="row">
          <TextField
            label="Last Name"
            required="true"
            onChange={(event, newValue) => this.setState({ lastName: newValue })}
          />
        </div>
        <div id="row">
          <TextField
            label="email"
            required="true"
            onChange={(event, newValue) => this.setState({ email: newValue })}
          />
        </div>
        <div id="row">
          <TextField
            type="password"
            label="password"
            required="true"
            onChange={(event, newValue) => this.setState({ password: newValue })}
          />
        </div>
      </div>
    )
  }
}
