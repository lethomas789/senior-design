import React, { Component } from 'react';
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


function ButtonAppBar(props) {

  //variables to store routes to redirect to with Link component
  const homeRoute = "/";
  const signupRoute = "/signup";
  const loginRoute = "/login";

  return (
    <div className= "root">
      <AppBar position="static">
        <Toolbar>
          <IconButton className = "menuButton" color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography component = {Link} to = {homeRoute} variant="h6" color="inherit" className = "grow">
            ECS193 ECommerce
          </Typography>
           <Button component = {Link} to = {signupRoute} color = "inherit"> Sign Up </Button> 
           <Button component = {Link} to = {loginRoute}color="inherit">Login </Button> 
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default ButtonAppBar;
