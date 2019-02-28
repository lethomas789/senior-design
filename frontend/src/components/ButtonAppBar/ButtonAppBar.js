import React, { Component } from 'react';
import './ButtonAppBar.css';
import {connect} from 'react-redux';
import actions from '../../store/actions';
import {Route, Link, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { DialogActions } from '@material-ui/core';

//variables to store routes to redirect to with Link component
const homeRoute = "/";
const aboutRoute = "/about";
const signupRoute = "/signup";
const loginRoute = "/login";
const shopRoute = "/shop";
const cartRoute = "/cart";

//style for cart to display number of items
const styles = theme => ({
  badge: {
    top: '50%',
    right: -3,
    // The border color match the background color.
    border: `2px solid ${
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[900]
    }`,
  },
});

//navbar component
class ButtonAppBar extends Component {
    constructor(props){
      super(props);
      this.state = {
        open: false,
        alertMessage: ''        
      }
      this.logoutUser = this.logoutUser.bind(this);
      this.viewCartCheck = this.viewCartCheck.bind(this);
      this.handleClose = this.handleClose.bind(this);
    }

    //handle dialog closing
    handleClose(){
      this.setState({
          open: false
      })
    }

    //logout user when clicking "Logout" on navbar
    //empty shopping cart
    logoutUser(){
      if (this.props.loginText === "Logout"){
        this.props.updateLogout();
        this.props.emptyCart();
        //display dialog
        this.setState({
          open: true,
          alertMessage: "Logout successful!"
        });
      }
    }

    //check if user is logged in to view cart
    viewCartCheck(){
      //prevent user from using cart until logged in
      if(this.props.loginValue === false){
        this.setState({
          open: true,
          alertMessage: "Please login to view cart"
        })
      }
      
      //if logged in, get cart and calculate cart's total
      else{
        const apiURL = "http://localhost:4000/api/getUserCart";
        //if user is logged in, get cart info
        if (this.props.login === true){
          axios.get(apiURL,{
            params:{
              user: this.props.user
            }
          })
          .then(res => {
            //after getting cart from server, update user's items in redux state
            alert("updating store with new items");
            this.props.updateItems(res.data.data);
          })
          .catch(err => {
            alert(err);
          })
        }
      }
    }
    
    render(){
      const { classes } = this.props;
      //conditonal rendering
      //render navbar based on whether user is logged in or not
      //if user is logged in, hide parts of navbar such as signup and display "Logout"
      if(this.props.loginValue === true && this.props.isAdmin === false){
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
                  <div id = "navLink">
                    <Button component = {Link} to = {aboutRoute} color = "inherit"> About </Button> 
                    <Button component = {Link} to = {loginRoute} color="inherit" onClick = {this.logoutUser}> {this.props.loginText} </Button> 
                    <Button component = {Link} to = {shopRoute} color = "inherit"> Shop </Button>
                    <Button component = {Link} to = {cartRoute} color = "inherit" onClick = {this.viewCartCheck}> 
                      <Badge badgeContent = {this.props.cartLength} color = "primary" classes={{ badge: classes.badge }}>
                        <CartIcon/> 
                      </Badge>
                    </Button>
                  </div>
              </Toolbar>
            </AppBar>
        </div>
        );
      }

      //admin version of navbar after logging in
      else if (this.props.loginValue === true && this.props.isAdmin === true){
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
                  <div id = "navLink">
                    <Button component = {Link} to = {aboutRoute} color = "inherit"> Edit Club Info </Button> 
                    <Button component = {Link} to = {aboutRoute} color = "inherit"> Edit Items </Button>
                    <Button component = {Link} to = {aboutRoute} color = "inherit"> Add Items </Button> 
                    <Button component = {Link} to = {aboutRoute} color = "inherit"> About </Button> 
                    <Button component = {Link} to = {loginRoute} color="inherit" onClick = {this.logoutUser}> {this.props.loginText} </Button> 
                    <Button component = {Link} to = {shopRoute} color = "inherit"> Shop </Button>
                    <Button color = "inherit" onClick = {this.viewCartCheck}> <CartIcon/> </Button>
                  </div>
                  <Dialog open = {this.state.open} onClose = {this.handleClose} aria-describedby = "alert-dialog-description">
                        <DialogContent>
                            <DialogContentText id = "alert-dialog-description">
                              {this.state.alertMessage}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick = {this.handleClose} color = "primary">
                                Ok
                            </Button>
                        </DialogActions>
                    </Dialog>
              </Toolbar>
            </AppBar>
          </div>
        );
      }

      else{
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
                  <div id = "navLink">
                    <Button component = {Link} to = {aboutRoute} color = "inherit"> About </Button> 
                    <Button component = {Link} to = {signupRoute} color = "inherit"> Sign Up </Button> 
                    <Button component = {Link} to = {loginRoute} color="inherit" onClick = {this.logoutUser}> {this.props.loginText} </Button> 
                    <Button component = {Link} to = {shopRoute} color = "inherit"> Shop </Button>
                    <Button color = "inherit" onClick = {this.viewCartCheck}> <CartIcon/> </Button>
                  </div>
                  <Dialog open = {this.state.open} onClose = {this.handleClose} aria-describedby = "alert-dialog-description">
                        <DialogContent>
                            <DialogContentText id = "alert-dialog-description">
                              {this.state.alertMessage}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick = {this.handleClose} color = "primary">
                                Ok
                            </Button>
                        </DialogActions>
                    </Dialog>
              </Toolbar>
            </AppBar>
        </div>
        );
      }
    }
  }

  //redux

  //dispatch action to reducer
  const mapDispatchToProps = dispatch => {
    return{
        //update store that user logged out
        updateLogout: () => dispatch({
          type: actions.LOGGED_OUT
        }),

        //update store cart is empty
        emptyCart: () => dispatch({
          type: actions.EMPTY_CART
        })
    }
  }

  //obtain state from store as props for component
  //get login value, login text, and cart length
  const mapStateToProps = state => {
    return{
        loginValue: state.auth.login,
        loginText: state.auth.text,
        user: state.auth.user,
        isAdmin: state.auth.isAdmin,
        cartLength: state.cart.items.length,
        items: state.cart.items
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(ButtonAppBar));
