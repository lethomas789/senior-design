import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Signup from '../Signup/Signup';
import './Home.css';

export default class Home extends Component {
  render() {
    return (
      <div id = "homeContainer">
        <div id = "textContainer">
          <h1> Welcome to ECS193 ECommerce! </h1>
          <p>This is a ecommerce website for UC Davis's clubs. 
          Here we make merchandise available from all different clubs of Davis.</p>
        </div>
      </div>
    )
  }
}



