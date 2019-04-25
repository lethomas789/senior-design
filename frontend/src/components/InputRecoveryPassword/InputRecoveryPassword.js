import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';

class InputRecoveryPassword extends Component {

  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: ''
    }
  }

  componentDidMount() {
    //check token from query param in url
    console.log("checking token");
    const apiURL = '/api/resetPass/checkToken';
    axios.get(apiURL)
      .then(res => {
        //get email from matching token in database
        if(res.data.success === true){
          this.setState({
            email: res.data.email
          })
        }
      })
      .catch(err => {
        alert(err);
      })
  }
  

  //check reset token 
  updatePassword = () => {
    //input checks for matching passwords and min/max length
    if(this.state.password != this.state.confirmPassword){
      alert("Passwords do not match");
      return;
    }

    else if (this.state.password.length < 8 || this.state.password.length > 20){
      alert("Minimum password length is 8 characters, max is 20");
      return;
    }

    //check token from query param in url
    //after getting email from database and user inputs new password, update new password
    axios.get('/api/resetPass/updatePass', {
      params:{
        email: this.state.email,
        newPassword: this.state.password
      }
    })
    .then(res => {
      if(res.data.success === true){
        alert(res.data.message);
      }
    })
    .catch(err => {
      alert(err);
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

  render() {
    return (
      <div>
        <div id = "enterEmailForm">
          <h1 id = "passwordTitle"> Password Recovery </h1>
          <h3> Enter email and new password: </h3>
          <form id = "emailForm">
            Password: <input label = "Password" type = "password" onChange = {this.handlePasswordField}/> 
            Confirm Password: <input label = "Confirm Password" type = "password" onChange = {this.handleConfirmPasswordField}/> 
          </form>
          <Button color = "primary" onClick = {this.updatePassword}> Recover Password </Button>
        </div>
      </div>
    )
  }
}

export default InputRecoveryPassword;
