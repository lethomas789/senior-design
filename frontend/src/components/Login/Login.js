import React, { Component } from 'react';
import {connect} from 'react-redux';
import actions from '../../store/actions';
import './Login.css';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Login extends Component{
    constructor(props){
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
    sendLogin(){
        const apiURL = "http://localhost:4000/api/login";
        axios.post(apiURL, {
            params:{
                email: this.state.email,
                password: this.state.password
            }
        })
        .then(res => {
            if(res.data.success === true){
                alert(res.data.message);
                //dispatch update login action to update login state
                this.props.updateLogin();
            }

            else{
                alert(res.data);
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

//redux, dispatch to update state
const mapDispatchToProps = dispatch => {
    return{
        updateLogin: () => dispatch({
            type: actions.LOGGED_IN
        })
    }
}

export default connect(null,mapDispatchToProps)(Login)

