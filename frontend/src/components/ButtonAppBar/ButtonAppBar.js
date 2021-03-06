import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "./ButtonAppBar.css";
import { connect } from "react-redux";
import actions from "../../store/actions";
import { Route, Link, Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import CartIcon from "@material-ui/icons/ShoppingCart";
import Badge from "@material-ui/core/Badge";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { DialogActions, OutlinedInput } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

//variables to store routes to redirect to with Link component
const homeRoute = "/";
const aboutRoute = "/about";
const signupRoute = "/signup";
const loginRoute = "/login";
const shopRoute = "/shop";
const cartRoute = "/cart";
const editClubRoute = "/editClubInfo";
const addProductRoute = "/addProduct";

//style for cart to display number of items
const styles = theme => ({
  badge: {
    top: "50%",
    right: -3,
    // The border color match the background color.
    border: `2px solid ${
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[900]
    }`
  }
});

//navbar component
class ButtonAppBar extends Component {
  state = {
    open: false,
    alertMessage: "",
    currentAdminOf: this.props.vendorID,
    adminsOf: this.props.adminsOf,
    openSelect: false,
    currentVendor: "",
    anchorEl: null
  };

  //when navbar loads, get list of all vendors in database
  //trying to get club names
  componentDidMount() {
    const apiURL = "/api/getVendorInfo";
    axios
      .get(apiURL)
      .then(res => {
        //update vendors of redux store
        this.props.updateVendors(res.data.vendors);
      })
      .catch(err => {
        alert(err);
      });
  }

  // handle menu
  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleAdminClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  //handle dialog closing
  handleClose = () => {
    this.setState({
      open: false
    });
  };

  //handle closing select
  handleCloseSelect = () => {
    this.setState({
      openSelect: false
    });
  };

  //handle open select
  handleOpenSelect = () => {
    this.setState({
      openSelect: true
    });
  };

  //logout user when clicking "Logout" on navbar
  //empty shopping cart
  logoutUser = () => {
    if (this.props.loginText === "Logout") {
      this.props.updateLogout();
      this.props.emptyCart();
      //display dialog
      this.setState({
        open: true,
        alertMessage: "Logout successful!"
      });
    }
  };

  //update value selected from dropdown menu
  //if user is an admin of multiple clubs, will change what is being updated
  handleSelect = event => {
    var currentVendorName = event.target.value;
    var currentVendorID = "";

    //search through list of vendors, check if name selected equals vendor
    //update vendor name selected and vid
    for (let i = 0; i < this.props.vendors.length; i++) {
      if (this.props.vendors[i].vendorName === currentVendorName) {
        currentVendorID = this.props.vendors[i].vid;
        this.props.updateCurrentVendor(currentVendorID, currentVendorName);
        break;
      }
    }
  };

  //check if user is logged in to view cart
  viewCartCheck = () => {
    //prevent user from using cart until logged in
    if (this.props.loginValue === false) {
      this.setState({
        open: true,
        alertMessage: "Please login to view cart"
      });
    }

    //if logged in, get cart and calculate cart's total
    else {
      const apiURL = "/api/getUserCart";
      //if user is logged in, get cart info
      if (this.props.login === true) {
        axios
          .get(apiURL, {
            params: {
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
          });
      }
    }
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;

    if (this.props.isAdmin) {
      var vendorList = this.props.adminsOf.map(result => {
        return (
          <MenuItem key={result.vid} value={result.vendorName}>
            {" "}
            {result.vendorName}{" "}
          </MenuItem>
        );
      });
    }

    return (
      <nav className="root">
        <AppBar position="static">
          <Toolbar>
            {/* MENU BUTTON */}
            {/* currently doesnt do anything so hide it */}
            {/* <IconButton
              className="menuButton"
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton> */}

            {/* HOME LABEL */}
            <Typography
              component={Link}
              to={homeRoute}
              variant="h6"
              color="inherit"
              className="grow"
            >
              ECS193 ECommerce
            </Typography>

            <Typography variant="h6" color="inherit">
              Select Club:
            </Typography>

            {/* NAV BUTTONS */}
            <div id="navLink">
              {/* SELECT CLUB */}
              <FormControl variant="filled" className="club-select">
                <InputLabel htmlFor="club-select">
                  {this.props.currentVendor}
                </InputLabel>

                <Select
                  value={this.props.currentvendor}
                  open={this.state.openSelect}
                  onClose={this.handleCloseSelect}
                  onOpen={this.handleOpenSelect}
                  onChange={this.handleSelect}
                  input={<OutlinedInput name={this.props.currentVendor} />}
                >
                  {vendorList}
                </Select>
              </FormControl>

              {/* <Button color="inherit">
                <InputLabel className="navLabel" color="white">
                  {" "}
                  {this.props.currentVendor}{" "}
                </InputLabel>
                <Select
                  color="inherit"
                  value={this.props.vendorID}
                  open={this.state.openSelect}
                  onClose={this.handleCloseSelect}
                  onOpen={this.handleOpenSelect}
                  onChange={this.handleSelect}
                >
                  {vendorList}
                </Select>
              </Button> */}

              {/* ADMIN BUTTONS */}
              {this.props.isAdmin ? (
                <Fragment>
                  <Button
                    aria-owns={anchorEl ? "admin-menu" : undefined}
                    aria-haspopup="true"
                    onClick={this.handleAdminClick}
                    style={{ color: "white" }}
                  >
                    Admin Menu
                  </Button>
                  <Menu
                    id="admin-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleMenuClose}
                  >
                    <MenuItem
                      component={Link}
                      to={editClubRoute}
                      color="inherit"
                      onClick={this.handleMenuClose}
                    >
                      {" "}
                      Edit Club Info{" "}
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to={addProductRoute}
                      color="inherit"
                      onClick={this.handleMenuClose}
                    >
                      {" "}
                      Add Items{" "}
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to={aboutRoute}
                      color="inherit"
                      onClick={this.handleMenuClose}
                    >
                      {" "}
                      Edit Items{" "}
                    </MenuItem>
                  </Menu>
                </Fragment>
              ) : (
                // else dont display admin stuff
                <Fragment />
              )}

              {/* BUTTONS FOR ALL USERS */}
              <Button component={Link} to={aboutRoute} color="inherit">
                {" "}
                About{" "}
              </Button>

              {/* display signup if not logged in */}
              {!this.props.loginValue ? (
                <Button component={Link} to={signupRoute} color="inherit">
                  {" "}
                  Sign Up{" "}
                </Button>
              ) : (
                <Fragment />
              )}

              {/* ACCOUNT BUTTON? */}

              {/*LOGIN/LOGOUT BUTTON*/}
              <Button
                component={Link}
                to={loginRoute}
                color="inherit"
                onClick={this.logoutUser}
              >
                {" "}
                {this.props.loginText}{" "}
              </Button>

              <Button component={Link} to={shopRoute} color="inherit">
                {" "}
                Shop{" "}
              </Button>

              {/* CART BUTTON */}
              {this.props.loginValue ? (
                // if logged in, display amt items in cart
                <Button
                  component={Link}
                  to={cartRoute}
                  color="inherit"
                  onClick={this.viewCartCheck}
                >
                  <Badge
                    badgeContent={this.props.cartLength}
                    color="primary"
                    classes={{ badge: classes.badge }}
                  >
                    <CartIcon />
                  </Badge>
                </Button>
              ) : (
                // else not logged in, display generic cart icon
                <Button color="inherit" onClick={this.props.viewCartCheck}>
                  <CartIcon />
                </Button>
              )}
            </div>

            {/* POP UP DIALOG */}
            {/* TODO: remove with an alert library for UX */}
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {this.state.alertMessage}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Ok
                </Button>
              </DialogActions>
            </Dialog>
          </Toolbar>
        </AppBar>
      </nav>
    );
  }
}

//redux

//dispatch action to reducer
const mapDispatchToProps = dispatch => {
  return {
    //update store that user logged out
    updateLogout: () =>
      dispatch({
        type: actions.LOGGED_OUT
      }),

    //update store cart is empty
    emptyCart: () =>
      dispatch({
        type: actions.EMPTY_CART
      }),

    //update vendors
    updateVendors: response =>
      dispatch({
        type: actions.GET_VENDORS,
        vendors: response
      }),

    //update vendor id
    updateCurrentVendor: (vendorID, vendorName) =>
      dispatch({
        type: actions.UPDATE_VENDOR_ID,
        vid: vendorID,
        vendor: vendorName
      })
  };
};

//obtain state from store as props for component
//get login value, login text, and cart length
const mapStateToProps = state => {
  return {
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ButtonAppBar));
