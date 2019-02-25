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
      this.logoutUser = this.logoutUser.bind(this);
      this.viewCartCheck = this.viewCartCheck.bind(this);
    }

    //logout user when clicking "Logout" on navbar
    //empty shopping cart
    logoutUser(){
      if (this.props.loginText === "Logout"){
        this.props.updateLogout();
        this.props.emptyCart();
      }
    }

    //check if user is logged in to view cart
    viewCartCheck(){
      if(this.props.loginValue === false){
        alert("Please login to view cart");
      }   
    }
    
    render(){
      const { classes } = this.props;
      //conditonal rendering
      //render navbar based on whether user is logged in or not
      //if user is logged in, hide parts of navbar such as signup and display "Logout"
      if(this.props.loginValue === true){
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

      //user is not logged in
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
        updateLogout: () => dispatch({
            type: actions.LOGGED_OUT
        }),

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
        cartLength: state.cart.items.length
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(ButtonAppBar));
