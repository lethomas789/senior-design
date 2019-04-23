import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';

class InputRecoveryPassword extends Component {

  constructor(props){
    super(props);
    this.state = {
      email:'',
      password: '',
      confirmPassword: ''
    }
  }

  //function to handle email change on input
  handleEmailField = (event) => {
    this.setState({
      email: event.target.value
    })
  }

  //change password on input
  handlePasswordField = (event) => {
    this.setState({
      password: event.target.value
    })
  }

  //change confirm password on input change
  handleConfirmPasswordField = (event) => {
    this.setState({
      confirmPassword: event.target.value
    })
  }

  //recoverPassword
  recoverPassword = () => {
    if(this.state.password != this.state.confirmPassword){
      alert("Passwords do not match");
      return;
    }

    const apiURL = '/api/setNewPassword';
    axios.patch(apiURL, {
      params:{
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword
      }
    })
    .then(res => {
      if(res.data.success === true){
        alert(res.data.message);
        this.props.history.push('/login');
      }
    })
    .catch(err => {
      alert(err);
    })
  }

  render() {
    return (
      <div>
        <div id = "enterEmailForm">
          <h1 id = "passwordTitle"> Password Recovery </h1>
          <h3> Enter email and new password: </h3>
          <form id = "emailForm">
            Email: <input onChange = {this.handleEmailField}/> 
            Password: <input label = "Password" type = "password" onChange = {this.handlePasswordField}/> 
            Confirm Password: <input label = "Confirm Password" type = "password" onChange = {this.handleConfirmPasswordField}/> 
          </form>
          <Button color = "primary" onClick = {this.recoverPassword}> Recover Password </Button>
        </div>
      </div>
    )
  }
}

export default InputRecoveryPassword;
