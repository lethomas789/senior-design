import React, { Component } from "react";
import "./Cart.css";
import axios from "axios";
import { connect } from "react-redux";
import actions from "../../store/actions";
import Grid from "@material-ui/core/Grid";
import CartItem from "../CartItem/CartItem";
import Checkout from "../Checkout/Checkout";
import { Link } from "react-router-dom";
import EmptyItem from "../EmptyItem/EmptyItem";

//component to display user's cart
class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      total: 0,
      cart: this.props.items,
      allVendors: [],
      vendorItemsSeparated: []
    };
  }

  //update total price of cart
  updateTotal = () => {
    //get total from items
    // var currentCart = this.props.items;
    var currentCart = this.state.cart;
    var priceTotal = 0;

    //if cart is empty, total price is $0
    if (currentCart.length === 0) {
      this.props.updateTotal(priceTotal);
    }

    //if there are items, calculate total price
    else {
      //go through each item in cart and sum up price
      for (let i = 0; i < currentCart.length; i++) {
        priceTotal += Number(currentCart[i].totalPrice);
      }
      priceTotal = priceTotal.toFixed(2);
      this.setState({
        total: priceTotal
      });
      this.props.updateTotal(priceTotal);
      this.separateVendors();
    }
  }

  //update total price based on quantity 
  updateItemTotal = (pid, newTotal, amt) => {
    for(let i = 0; i < this.state.cart.length; i++){
      if(this.state.cart[i].pid === pid){
        this.state.cart[i].totalPrice = newTotal;
        this.state.cart[i].amtPurchased = amt;
      }
    }

    console.log("checking state of cart ", this.state.cart);

    //update cart and total of cart
    //this.props.updateCart(this.state.cart);
    this.updateTotal();
  }

  //function to separate items by vendors
  separateVendors = () => {
    //separate payment by vid
    //find which vendors exist, array to keep track existing vendors
    var currentVendorArray = [];

    //go through each item in user's cart, extract vid to determine how many vendors to create buttons for
    for(let i = 0; i < this.props.items.length; i++){
      const currentVid = this.props.items[i].vid;
      if(currentVendorArray.includes(currentVid) === false){
        currentVendorArray.push(currentVid);
      }
    }

    //store result of array of vendors available
    this.setState({
      allVendors: currentVendorArray
    }, () => {
      console.log("determine which vids were found ", this.state.allVendors);
    });

    //call function to separate items based on vendor
    this.separateItems(currentVendorArray);
  }

  //pass list of vendors to function to categorize items 
  separateItems = (vendorList) => {
    //array that consists of arrays of items
    //array that holds arrays
    var itemsArray = [];

    //for each vendor in the vendor list, determine which items have matching vid and push to temp array
    for(let i = 0; i < vendorList.length; i++){
      //current vendor to check, temp array
      const currentVendor = vendorList[i];
      var currentItems = new Array();

      //for each item in cart, determine which vid matches current vendor that is being checked
      for(let j = 0; j < this.props.items.length; j++){
        if(this.props.items[j].vid === currentVendor){
          currentItems.push(this.props.items[j]);
        }
      }

      //push current array of items to array of arrays
      itemsArray.push(currentItems);
    }
    
    //update state
    this.setState({
      vendorItemsSeparated: itemsArray
    })
  }

  //get cart from server for user
  componentDidMount() {
    //call function to separate vendors when component loads
    this.separateVendors();

    //for each vid create an array to 
    this.updateTotal();
  }

  //render cart items to cart view
  render() {
    const cart = this.props.items.map(result => {
      console.log("result in cart:", result);
      if (result.size === undefined) {
        return (
          <CartItem
            key={result.productName}
            imageSrc={result.image[0]}
            pid={result.pid}
            vendorID={result.vid}
            productName={result.productName}
            amtPurchased={result.amtPurchased}
            productPrice={result.productPrice}
            totalPrice={result.totalPrice}
            updateItemTotal = {this.updateItemTotal}
          />
        );
      } else {
        return (
          <CartItem
            key={result.productName}
            size={result.size}
            imageSrc={result.image[0]}
            pid={result.pid}
            vendorID={result.vid}
            productName={result.productName}
            amtPurchased={result.amtPurchased}
            productPrice={result.productPrice}
            totalPrice={result.totalPrice}
            updateItemTotal = {this.updateItemTotal}
          />
        );
      }
    });

    //render multiple checkout buttons based on 
    const checkoutButtons = this.state.vendorItemsSeparated.map(result => {
      console.log("checking result rendering", result);

      //calculate sum of price for all items
      var currentVendorTotal = 0;
      for(let i = 0; i < result.length; i++){
        currentVendorTotal += result[i].totalPrice;
      }

      //pass array of items and total price as props to each checkout component
      return(
        <Checkout cartItems = {result} totalValue = {currentVendorTotal}/>
      );

    })

    return (
      <div className="cart-table-container">
        {/* TABLE HEADERS */}
        <span className="table-header table-row">
          <span>
            <strong>My Cart ({this.props.items.length})</strong>
          </span>
          <span>
            <strong>Price</strong>
          </span>
          <span>
            <strong>Qty</strong>
          </span>
          <span>
            <strong>Total</strong>
          </span>
        </span>

        {/* TABLE DATA */}
        {/* TODO have conditional to render empty page */}
        {cart}

        <div id="total-text">Total</div>
        <div id="total-price">${this.state.total}</div>
        <div id="btn-paypal">
          {checkoutButtons}
          {/* <Checkout cartItems = {this.state.cart} totalValue={this.state.total} /> */}
        </div>
      </div>
    );
  }
}

//redux
//dispatch action to reducer, get user's cart
const mapDispatchToProps = dispatch => {
  return {
    updateItems: response =>
      dispatch({
        type: actions.GET_CART,
        cart: response
      }),

    //update store of cart total
    updateTotal: sum =>
      dispatch({
        type: actions.UPDATE_TOTAL,
        total: sum
      }),

    //update cart
    updateCart: cart => 
      dispatch({
        type: actions.UPDATE_CART,
        items: cart
      })
  };
};

//obtain state from store as props for component
//get cart items, login value, and user email
const mapStateToProps = state => {
  return {
    items: state.cart.items,
    login: state.auth.login,
    user: state.auth.user
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
