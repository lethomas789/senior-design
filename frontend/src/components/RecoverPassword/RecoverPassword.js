import React, { Component } from 'react';
import './RecoverPassword.css';
import axios from 'axios';
import Button from '@material-ui/core/Button';

class RecoverPassword extends Component {

  constructor(props){
    super(props);
    this.state = {
      email: ''
    }
  }

  //function to handle email change on input
  handleEmailField = (event) => {
    this.setState({
      email: event.target.value
    })
  }

  //function called when clicking recover password
  recoverPassword = () => {
    //get request to send email with password
    const apiURL = '/api/recoverPassword';
    console.log("this is the input of the user's email", this.state.email);
    axios.get(apiURL, {
      params:{
        email: this.state.email
      }
    })
    .then(res => {
      if(res.data.success === true){
        console.log(res.data);
        console.log(String(res.data.password));
        alert("password recovered!");
      }

      else{
        alert(res.data.message);
        console.log("no password for user that signed in with google");
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
          <h3> Enter email: </h3>
          <form id = "emailForm">
            <input onChange = {this.handleEmailField}/> 
          </form>
          <Button color = "primary" onClick = {this.recoverPassword}> Recover Password </Button>
        </div>
      </div>
    )
  }
}

export default RecoverPassword;
