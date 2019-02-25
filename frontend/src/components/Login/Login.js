import React, { Component } from 'react';
import {connect} from 'react-redux';
import actions from '../../store/actions';
import './Login.css';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

//Login component, allows user to login with email and password credentials
class Login extends Component{
    constructor(props){
        super(props);
        //store user input
        this.state = {
            email: "",
            password: ""        
        }
        this.getCart = this.getCart.bind(this);
        this.sendLogin = this.sendLogin.bind(this);
    }

    //get logged in user's cart info
    getCart(){
      const apiURL = "/api/getUserCart";
      axios.get(apiURL, {
        params:{
          user: this.state.email
        }
      }).then(res => {
          //after getting cart info, update redux store container
          this.props.updateItems(res.data.data);
        })
        .catch(err => {
          alert(err);
        })
    }

    //send login request, display if login was successful
    sendLogin(){
        const apiURL = "/api/login";
        axios.post(apiURL, {
            params:{
              email: this.state.email,
              password: this.state.password
            }
        })
        //successful login, display message
        .then(res => {
            if(res.data.success === true){
                alert(res.data.message);
                //dispatch update login action to update login state
                let email = this.state.email;
                this.props.updateLogin(email);

                //after updating login, get cart info
                this.getCart();
            }
            //display error message with logging in
            else{
                alert(res.data.message);
            }
        })
        .catch(err => {
            alert(err);
        })
    }

    render(){
        return(
            <div id = "loginContainer">
                <div id = "loginForms">
                    <h1> Login </h1>
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
                    <Button id = "signupButton" onClick = {this.sendLogin}> Login  </Button>
                </div>
            </div>
        );
    }
}

//redux, dispatch action to reducer to update state
const mapDispatchToProps = dispatch => {
    return{
        //update logged in values
        updateLogin: (currentEmail) => dispatch({
            type: actions.LOGGED_IN,
            user: currentEmail
        }),

        //get user's cart from state after logging in
        updateItems: (response) => dispatch({
          type: actions.GET_CART,
          cart: response
        })
    }
}

export default connect(null,mapDispatchToProps)(Login)

