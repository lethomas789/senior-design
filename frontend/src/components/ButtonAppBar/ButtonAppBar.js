import React, { Component } from 'react';
import {connect} from 'react-redux';
import actions from '../../store/actions';
import {Route, Link, BrowserRouter as Router} from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import './ButtonAppBar.css';

  //variables to store routes to redirect to with Link component
  const homeRoute = "/";
  const aboutRoute = "/about";
  const signupRoute = "/signup";
  const loginRoute = "/login";
  const shopRoute = "/shop";


class ButtonAppBar extends Component {
    constructor(props){
      super(props);
      this.logoutUser = this.logoutUser.bind(this);
    }

    logoutUser(){
      if (this.props.loginText === "Logout"){
        this.props.updateLogout();
      }
    }

    render(){
      return(
        <div className= "root">
          <AppBar position="static">
            <Toolbar>
              <IconButton className = "menuButton" color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton>
              <Typography component = {Link} to = {homeRoute} variant="h6" color="inherit" className = "grow">
                ECS193 ECommerce
              </Typography>
                <Button component = {Link} to = {aboutRoute} color = "inherit"> About </Button> 
                <Button component = {Link} to = {signupRoute} color = "inherit"> Sign Up </Button> 
                <Button component = {Link} to = {loginRoute} color="inherit" onClick = {this.logoutUser}> {this.props.loginText} </Button> 
                <Button component = {Link} to = {shopRoute} color = "inherit"> Shop </Button>
            </Toolbar>
          </AppBar>
      </div>
      );
    }
  }

  const mapDispatchToProps = dispatch => {
    return{
        updateLogout: () => dispatch({
            type: actions.LOGGED_OUT
        })
    }
  }

  const mapStateToProps = state => {
    return{
        loginValue: state.auth.login,
        loginText: state.auth.text
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(ButtonAppBar);
