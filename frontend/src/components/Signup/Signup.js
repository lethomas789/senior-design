import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './Signup.css';
import { RequiredForm, EmailForm, ConfirmPasswordForm } from '../Forms/Forms';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

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
      submitted: false,


      validPassword: false,
      validConfirm: false,
      allFormsValid: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.passwordListener = this.passwordListener.bind(this);
    this.confirmPasswordListener = this.confirmPasswordListener.bind(this);
    this.areFormsValid = this.areFormsValid.bind(this);
  }

  componentDidMount() {
    // add custom rule to Validator Form
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== this.state.password) {
        return false;
      }
      return true;
    });
  }

  // on every different listener, call a check submit disabled

  passwordListener(result) {
    this.setState({ validPassword: result });
    let val = this.areFormsValid();
    this.setState({ allFormsValid: val });
  }

  confirmPasswordListener(result) {
    this.setState({ validConfirm: result });
    let val = this.areFormsValid();
    this.setState({ allFormsValid: val });
  }

  areFormsValid() {
    const {validPassword, validConfirm} = this.state;
    if (validPassword === true && validConfirm === true) {
      console.log('TRUE');
      return true;
    }
    console.log('FALSE');
    return false;
  }

  

  //send signup request
  handleSubmit(event){
    /*
    if (!this.canBeSubmitted()) {
      event.preventDefault();
      return;
    }
    */
    this.setState({ submitted: true }, () => {
      setTimeout(() => this.setState({ submitted:false }), 5000);
    });

    axios.post('http://localhost:4000/api/signup', {
      params: {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password
      }
    }).then(res => {
      if(res.data.success === true){
        alert("Signup successful!");
      }

      else{
        alert(res.data);
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  handleChange = (event) => {
    const formValue = event.target.value;
    this.setState({ [event.target.name]: formValue})
  }

  canBeSubmitted() {
    const { firstName, lastName, email, password, confirmPassword } = this.state;
  }
  
  render() {
    const { password, confirmPassword, submitted, allFormsValid } = this.state;
    const isEnabled = this.canBeSubmitted();
    return (
      <div id = "signupContainer">
        <div id = "signupForms">
          <h1> Sign Up </h1>
          <ValidatorForm
            ref="form"
            onSubmit={this.handleSubmit}
            onError={errors => console.log(errors)}
          >
            {/* <RequiredForm id="row" name="First Name"
              formValue={(liftedState) => this.setState({ firstName: liftedState })}
            />
            <RequiredForm id="row" name="Last Name"
              formValue={(liftedState) => this.setState({ lastName: liftedState })}
            />
            <EmailForm id="row"
              formValue={(liftedState) => this.setState({ email: liftedState })}
            /> */}

            <div id="row">
              <TextValidator
                label="Password"
                name="password"
                type="password"
                onChange={this.handleChange}
                value={password}
                validatorListener={this.passwordListener}
                validators={
                  ['required',
                    // 'matchRegexp:^(?=.*d)(?=.*[a-zA-Z])$',
                    'minStringLength:8',
                  ]}
                errorMessages={
                  ['Field required',
                    // 'Must contain a number and a letter',
                    'Must be at least 8 characters long'
                  ]}
                required="true"
                // helperText={'Must be at least 8 characters long including a number and a letter'}
              />

              <div id="row">
                <TextValidator
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  onChange={this.handleChange}
                  value={confirmPassword}
                  validatorListener={this.confirmPasswordListener}
                  validators={['required', 'isPasswordMatch']}
                  errorMessages={
                    ['Field required',
                      'The passwords do not match'
                    ]}
                  required="true"
                />
              </div>
            </div>

            <Button 
              raised
              type="submit"
              disabled={!allFormsValid}
            >
            FUCK YOU
            </Button>

          </ValidatorForm>
      </div>
      </div>
    )
  }
}
