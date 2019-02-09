/**
|--------------------------------------------------
| Custom forms classes with validation.
| Uses react-material-ui-form-validator library
|--------------------------------------------------
*/

import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

/*
 * RequiredForm: form w/ validation only 'required' validation 
 * 
 * props: 
 *   - name: name of the form and label
 *   - id: id to pass into surround form div
 * 
 * Use case ex: First Name, Last Name, etc.
 */ 
class RequiredForm extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      formValue: '',
    }
  }

  handleChange = (event) => {
    const formValue = event.target.value;
    this.setState({ formValue })
    this.props.formValue(formValue);
  }

  render() {
    const { formValue } = this.state;
    return (
      <div id={this.props.id}>
        <TextValidator
          label={this.props.name}
          name={this.props.name}
          onChange={this.handleChange}
          value={formValue}
          validators={['required', 'matchRegexp:^[A-Za-z0-9]+$']}
          errorMessages={['Field required', 'No special characters allowed']}
          required="true"
          // helperText={''}
        />
      </div>
    )
  }
}

class EmailForm extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      email: '',
    }
  }
  
  handleChange = (event) => {
    const email = event.target.value;
    this.setState({ email })
    this.props.formValue(email);
  }
  
  render() {
    const { email } = this.state;
    return (
      <div id={this.props.id}>
        <TextValidator
          label="Email"
          name="email"
          onChange={this.handleChange}
          value={email}
          validators={['required', 'isEmail']}
          errorMessages={['Field required', 'Must be valid email']}
          required="true"
          // helperText={''}
        />
      </div>
    );
  }
}

class ConfirmPasswordForm extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       password: '',
       confirmPasword: '',
    }
  }

  handleChange = (event) => {
    const formValue = event.target.value;
    this.setState({ [event.target.name]: formValue})
    this.props.formValue(formValue);
  }
  
  render() {
    const { password, confirmPassword } = this.state;
    return (
      <div id={this.props.id}>
        <TextValidator
          label="Password"
          name="password"
          type="password"
          onChange={this.handleChange}
          value={password}
          validators={['required']}
          errorMessages={['Field required']}
          required="true"
          helperText={'Must be at least 8 characters long including a number and a letter'}
        />

        <TextValidator
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          onChange={this.handleChange}
          value={confirmPassword}
          validators={['required']}
          errorMessages={['Field required']}
          required="true"
        />
      </div>
    );
  }
}


export {
  RequiredForm,
  EmailForm,
  ConfirmPasswordForm
}