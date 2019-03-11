import React, { Component } from 'react';
import './ShopItem.css';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import actions from '../../store/actions';
import { connect } from 'react-redux';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import {Link, withRouter} from 'react-router-dom';

//component to display product info
class ShopItem extends Component {
  constructor(props){
    super(props);

    //initial state of products
    this.state = {
      name: this.props.productName,
      price: this.props.productPrice,
      pid: this.props.pid,
      amtPurchased: 1,
      vendorID: this.props.vendorID,
      open: false,
      alertMessage: '',
      imageLink: this.props.imageSrc
    }

    //bind functions to component
    this.addItem = this.addItem.bind(this);
    this.updateVendor = this.updateVendor.bind(this);
    this.showDetailed = this.showDetailed.bind(this);
  }

  //update vendor in redux store
  updateVendor(){
    var viewVendor = this.state.vendorID;
    console.log("trying to update vendor ", viewVendor);
    this.props.updateVendor(viewVendor);
  }

  //function to update cart of user
  //add item to user's cart
  addItem(){
    //check if user is logged in
    //only allow user to add to cart if logged in
    if(this.props.login === false){
      this.setState({
        open: true,
        alertMessage: "Please login to add to cart!"
      })
    }

    else{
      //update user's cart on server
      var apiURL = "/api/getUserCart/addItems";
      axios.post(apiURL, {
        params:{
          user: this.props.user,
          pid: this.state.pid,
          amtPurchased: this.state.amtPurchased,
          vendorID: this.state.vendorID,
          image: this.state.imageLink
        }
      })
      .then(res => {
        if(res.data.success === true){
          //after adding to item, get updated cart
          const getCartURL = "/api/getUserCart";
          axios.get(getCartURL, {
            params:{
              user: this.props.user
            }
          })
          .then(res => {
            //after getting cart info, update redux store container
            this.props.updateItems(res.data.data);
            this.setState({
              open: true,
              alertMessage: "Item added to cart!"
            });
          })
          .catch(err => {
            alert(err);
          })
        }
      })
      .catch(err => {
        alert(err);
      })
    }
  } //end of add item

  //show detailed info of item, reroute
  showDetailed(){
    //update which item was selected for detialed view
    this.props.updateSelectedItem(this.state.pid);
    this.props.history.push('/itemDetails');
  }

  render() {
    return (
      <Grid item xs = {4} spacing = {2}>
        <div className = "centerPage">
          <div className = "box">
            <div className = "center">
              <img onClick = {this.showDetailed} src={this.props.imageSrc}  width="100%" height="100%"/>
            </div>
          </div>

         <div className = "resizing">
            <h5>
              {this.props.productName}
            </h5>
            <p>
              ${this.props.productPrice}
              <Button size="small" color="primary" onClick = {this.addItem}>
                Add To Cart
              </Button>

              <Button size="small" color="primary" onClick = {this.updateVendor}>
              <Link to = "/vendorProducts"> More From Vendor </Link>
              </Button>
            </p>
          </div>
        </div>
      </Grid>
    )
  }
}

//obtain state from store as props for component
//get login value and user email
const mapStateToProps = state => {
  return{
      user: state.auth.user,
      login: state.auth.login
  }
}

//dispatch action to reducer
//update redux state of current cart
const mapDispatchToProps = dispatch => {
  return{
      //get user's cart from state after logging in
      updateItems: (response) => dispatch({
        type: actions.GET_CART,
        cart: response
      }),

      updateVendor: (newVendor) => dispatch({
        type: actions.GET_VENDOR_PRODUCTS,
        vendor: newVendor
      }),

      updateSelectedItem: (pid) => dispatch({
        type: actions.UPDATE_SELECTED_ITEM,
        itemID: pid
      })
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ShopItem));
