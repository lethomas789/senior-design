import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import {connect} from 'react-redux';
import actions from '../../store/actions';
import './Login.css';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { DialogActions } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'; 
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import painting from '../../images/painting.jpg';
import {withRouter} from 'react-router-dom';

const styles = theme => ({
    progress: {
      margin: theme.spacing.unit * 2
    }
});

//Login component, allows user to login with email and password credentials
class Login extends Component{
    constructor(props){
        super(props);
        //store user input
        this.state = {
            email: "",
            password: "",
            open: false,
            progressValue: 0,
            progressVariant: 'determinate',
            responseMessage: ''        
        }
        this.getCart = this.getCart.bind(this);
        this.sendLogin = this.sendLogin.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
    }

    //get logged in user's cart info
    getCart(){
   //   const apiURL = "http://localhost:4000/api/getUserCart"
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
        //load progress circle to wait for login check
        this.setState({
            progressValue: 50,
            progressVariant: "indeterminate"
        });
        //const apiURL = "http://localhost:4000/api/login";
        const apiURL = "/api/login";
	axios.post(apiURL, {
            params:{
              email: this.state.email,
              password: this.state.password
            }
        })
        //successful login, display message
        .then(res => {
            //login for regular user, non-admin
            if(res.data.success === true && res.data.vendors.length === 0){
                //dispatch update login action to update login state
                let email = this.state.email;
                this.props.updateLogin(email);

                //after updating login, get cart info
                this.getCart();

                //display dialog for login successful
                this.setState({
                    open: true,
                    progressValue: 0,
                    progressVariant: "determinate",
                    responseMessage: "Login Succesful!"
                });
            }

            else if (res.data.success === true && res.data.vendors.length > 0){

                //after determining user is an admin, get object list of user's active vendors
                console.log("admin login", res.data);

                const vendorURL = "/api/adminUser";
                axios.get(vendorURL, {
                    params:{
                        user: this.state.email
                    }
                })
                .then(res => {
                    console.log(res.data);
                    let currentVendorID = res.data.vendors[0].vid;
                    let email = this.state.email;
                    let currentVendors = res.data.vendors;
                    let currentVendorName = res.data.vendors[0].vendorName;

                    //update redux store state
                    this.props.updateAdminLogin(email, currentVendorID, currentVendors, currentVendorName);

                    //after updating login, get cart info
                    this.getCart();
                
                    //display dialog for login successful
                    this.setState({
                        open: true,
                        progressValue: 0,
                        progressVariant: "determinate",
                        responseMessage: "Login Succesful!"
                    });

                })
                .catch(err => {
                    alert(err);
                })
            }     
            //display error message with logging in
            else{
                this.setState({
     		    open: true,
                    progressValue: 0,
                    progressVariant: "determinate",
                    responseMessage: res.data.message
                });
            }
        })
        .catch(err => {
            alert(err);
        })
    }

    //handle dialog closing
    handleClose(){
        this.setState({
            open: false
        });

        if(this.props.login === true){
            this.props.history.push('/shop');
        }
    }

    //handle enter key being pressed
    handleEnter(e){
        var key = e.keyCode;
        if(key === 13){
            this.sendLogin();
        }
    }

    //response values after oauth returns with email login and password
    responseGoogle = (response) => {
        //after getting response from google, proceed with login process of redux state
        //send login parameters to backend
        var email = response.w3.U3;
        var firstName = response.w3.ofa;
        var lastName = response.w3.wea;

        //update email of user logged in by modifying state
        this.setState({
            email: email,
        });

        //make api call to login with gmail
        axios.get('/api/login/gmail', {
            params:{
                email: email,
                firstName: firstName,
                lastName: lastName
            }
        })
        .then(res => {
            //check for login success status
            if(res.data.success === true && res.data.vendors.length === 0){
                //dispatch update login action to update login state
                this.props.updateLogin(email);

                //after updating login, get cart info
                this.getCart();

                //display dialog for login successful
                this.setState({
                    open: true,
                    progressValue: 0,
                    progressVariant: "determinate",
                    responseMessage: "Login Succesful!"
                });
            }

            else if (res.data.success === true && res.data.vendors.length > 0){
                const vendorURL = "/api/adminUser";
                axios.get(vendorURL, {
                    params:{
                        user: this.state.email
                    }
                })
                .then(res => {
                    let currentVendorID = res.data.vendors[0].vid;
                    let email = this.state.email;
                    let currentVendors = res.data.vendors;
                    let currentVendorName = res.data.vendors[0].vendorName;

                    //update redux store state
                    this.props.updateAdminLogin(email, currentVendorID, currentVendors, currentVendorName);

                    //after updating login, get cart info
                    this.getCart();
                
                    //display dialog for login successful
                    this.setState({
                        open: true,
                        progressValue: 0,
                        progressVariant: "determinate",
                        responseMessage: "Login Succesful!"
                    });

                })
                .catch(err => {
                    alert(err);
                })
            }// end of admin login

            else{
                this.setState({
                    open: true,
                    progressValue: 0,
                    progressVariant: "determinate",
                    responseMessage: res.data.message
                });
            }
        })
        .catch(err => {
            alert(err);
        })
    }
    render(){
        const { classes } = this.props;
        return(
            <div id = "loginContainer">
                <div id = "loginForms">
                    <Paper className = "paperContainer">
                        <h1> Login </h1>
                        <div className = "textForm" id="row">
                            <TextField
                            id = "outline-simple-start-adornment"
                            label="Email"
                            required="true"
                            onChange={(event) => this.setState({ email: event.target.value })}
                            onKeyDown = {this.handleEnter}
                            />
                        </div>
                        <div className = "textForm" id="row">
                            <TextField
                            type="password"
                            label="Password"
                            required="true"
                            onChange={(event) => this.setState({ password: event.target.value })}
                            onKeyDown = {this.handleEnter}
                            />
                        </div>

                        <div className = "pushDown">
                        <Button variant = "contained" color = "primary" onClick = {this.sendLogin}> Login  </Button>
                        </div>
			<div className = "pushDown2">
				<GoogleLogin clientId="409029968816-1bf8e3qtt6jb2ivj9udb1qata3q0bdrc.apps.googleusercontent.com"
				buttononText="Login"
				onSuccess={this.responseGoogle}
				onFailure={this.responseGoogle}
				cookiePolicy={'single_host_origin'}
				/>
			</div>
                    </Paper>
                 
                    <div className = "progressContainer">
                        <div className = "circle">
                            <CircularProgress className = "loadingCircle" size = {80} variant = {this.state.progressVariant} value = {this.state.progressValue} className = {classes.progress}/>
                        </div>
                    </div>

                    <Dialog open = {this.state.open} onClose = {this.handleClose} aria-describedby = "alert-dialog-description">
                        <DialogContent>
                            <DialogContentText id = "alert-dialog-description">
                                {this.state.responseMessage}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick = {this.handleClose} color = "primary">
                                Ok
                            </Button>
                        </DialogActions>
                    </Dialog> 
                </div>
            </div>
        );
    }
}

//obtain state from store as props for component
//get cart items, login value, and user email
const mapStateToProps = state => {
    return{
      items: state.cart.items,
      login: state.auth.login,
      user: state.auth.user,
      vendors: state.vendor.vendors
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
        }),

        //update admin login
        updateAdminLogin: (currentEmail, vendorID, adminsOf, vendor) => dispatch({
            type: actions.ADMIN_LOGGED_IN,
            user: currentEmail,
            vid: vendorID,
            admins: adminsOf,
            currentVendor: vendor
        })
    }
}

Login.propsTypes = {
    classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(Login));
