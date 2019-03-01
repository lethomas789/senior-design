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
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

//variables to store routes to redirect to with Link component
const homeRoute = "/";
const aboutRoute = "/about";
const signupRoute = "/signup";
const loginRoute = "/login";
const shopRoute = "/shop";
const cartRoute = "/cart";
const editClubRoute = "/editClubInfo";
const addProductRoute = "/addProduct";
const testPaypal = "/testPaypal";

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
        alertMessage: '',
        currentAdminOf: this.props.vendorID,
        adminsOf: this.props.adminsOf,
        openSelect: false,
        currentVendor: ''        
      }
      this.logoutUser = this.logoutUser.bind(this);
      this.viewCartCheck = this.viewCartCheck.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handleSelect = this.handleSelect.bind(this);
      this.handleCloseSelect = this.handleCloseSelect.bind(this);
      this.handleOpenSelect = this.handleOpenSelect.bind(this);
    }

    //when navbar loads, get list of all vendors in database
    //trying to get club names
    componentDidMount(){
      const apiURL = "http://localhost:4000/api/getVendorInfo";
      axios.get(apiURL)
        .then(res => {
          //update vendors of redux store
          this.props.updateVendors(res.data.vendors);
        })
        .catch(err => {
          alert(err);
        })
    }

    //handle dialog closing
    handleClose(){
      this.setState({
          open: false
      })
    }

    //handle closing select
    handleCloseSelect(){
      this.setState({
          openSelect: false
      })
    }

    //handle open select
    handleOpenSelect(){
      this.setState({
        openSelect: true
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

    //update value selected from dropdown menu
    //if user is an admin of multiple clubs, will change what is being updated
    handleSelect(event){
      var currentVendorName = event.target.value;
      var currentVendorID = '';

      //search through list of vendors, check if name selected equals vendor
      //update vendor name selected and vid
      for(let i = 0; i < this.props.vendors.length; i++){
        if(this.props.vendors[i].vendorName === currentVendorName){
          currentVendorID = this.props.vendors[i].vid;
          this.props.updateCurrentVendor(currentVendorID, currentVendorName);
          break;
        }
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

        const vendorList = this.props.vendors.map(result => {
          return <MenuItem key = {result.vid} value = {result.vendorName}> {result.vendorName} </MenuItem>
        })

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
                    <Button color = "inherit"> Change Club: </Button> 
                    <Button color = "inherit">
                      <InputLabel className = "navLabel" color = "inherit"> {this.props.currentVendor} </InputLabel>
                      <Select color = "inherit" value = {this.props.vendorID} open = {this.state.openSelect} onClose = {this.handleCloseSelect} onOpen = {this.handleOpenSelect} onChange = {this.handleSelect}>
                        {vendorList}
                      </Select>
                    </Button>
                    <Button component = {Link} to = {editClubRoute} color = "inherit"> Edit Club Info </Button> 
                    <Button component = {Link} to = {addProductRoute} color = "inherit"> Add Items </Button> 
                    <Button component = {Link} to = {aboutRoute} color = "inherit"> Edit Items </Button>
                    <Button component = {Link} to = {aboutRoute} color = "inherit"> About </Button> 
                    <Button component = {Link} to = {loginRoute} color="inherit" onClick = {this.logoutUser}> {this.props.loginText} </Button> 
                    <Button component = {Link} to = {shopRoute} color = "inherit"> Shop </Button>
                    <Button component = {Link} to = {cartRoute} color = "inherit" onClick = {this.viewCartCheck}>
                      <Badge badgeContent = {this.props.cartLength} color = "primary" classes={{ badge: classes.badge }}>
                        <CartIcon/> 
                      </Badge>
                    </Button>
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
                    <Button component = {Link} to = {testPaypal} color="inherit">TEST PAYPAL</Button> 
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
        }),

        //update vendors
        updateVendors: (response) => dispatch({
          type: actions.GET_VENDORS,
          vendors: response
        }),

        //update vendor id
        updateCurrentVendor: (vendorID ,vendorName) => dispatch({
          type: actions.UPDATE_VENDOR_ID,
          vid: vendorID,
          vendor: vendorName
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
        items: state.cart.items,
        adminsOf: state.auth.adminsOf,
        vendorID: state.auth.vendorID,
        vendors: state.vendor.vendors,
        currentVendor: state.auth.currentVendor
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(ButtonAppBar));
