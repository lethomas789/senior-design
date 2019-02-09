import React, { Component } from 'react';
import './Login.css';
import axios from 'axios';
import { RequiredForm, EmailForm, ConfirmPasswordForm } from '../Forms/Forms';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default class Login extends Component {
    constructor(props) {
        super(props);
        //store user input
        this.state = {
            email: "",
            password: ""
        }
        this.sendLogin = this.sendLogin.bind(this);
    }

    //send login request, display if login was successful
    //retrieve JWT to use for authetnicated page access
    sendLogin() {
        const apiURL = "http://localhost:4000/api/login";
        axios.post(apiURL, {
            params: {
                email: this.state.email,
                password: this.state.password
            }
        })
            .then(res => {
                if (res.data.success === true) {
                    console.log(res.data);
                    alert("Login Successful!");
                }

                else {
                    console.log(res.data);
                    alert(res.data);
                }
            })
            .catch(err => {
                alert(err);
            })

    }

    render() {
        return (
            <div id="loginContainer">
                <div id="loginForms">
                    <h1> Login </h1>
          <ValidatorForm
            ref="form"
            onSubmit={this.handleSubmit}
            onError={errors => console.log(errors)}
          >
            <EmailForm id="row"
              formValue={(liftedState) => this.setState({ email: liftedState })}
            />
            <RequiredForm id="row" name="Password"
              formValue={(liftedState) => this.setState({ password: liftedState })}
            />
            <Button 
              raised
              type="submit"
            >Login
            </Button>

            </ValidatorForm>
                </div>
            </div>
        );
    }
}

