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
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

//component to display user's cart
class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      total: 0,
      cart: this.props.passedItems,
      vendor: this.props.passedVendor,
      vendorsInView: this.props.passedAllVendors
    };
  }

  //update total price of cart
  updateTotal = () => {
    //get total from items
    var currentCart = this.state.cart;
    var priceTotal = 0;

    //if cart is empty, total price is $0
    if (currentCart.length === 0) {
      this.setState({
        total: 0
      });
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
    }
  };

  //update total price based on quantity
  //if user changes quantity in selector, find the matching item via pid and update total price/amount purchased 
  updateItemTotal = (pid, newTotal, amt) => {
    var currentCart = this.state.cart;
    for (let i = 0; i < currentCart.length; i++) {
      if (currentCart[i].pid === pid) {
        currentCart[i].totalPrice = newTotal;
        currentCart[i].amtPurchased = amt;
      }
    }

    console.log("checking state of cart ", this.state.cart);
    this.setState(
      {
        cart: currentCart
      },
      () => {
        //update cart and total of cart
        this.updateTotal();
      }
    );
  };

  //update cart of items in current vendor if an item is removed from CartItem
  //function passed as prop to child, child calls parent function to update state of items in cart
  updateCartAfterDelete = (newItems) => {
    this.setState({
      cart: newItems
    }, () => {
      //no more items for this vendor cart, update CartView to remove this cart
      if(this.state.cart.length === 0){
        window.location.reload();
        // console.log("passed all vendors to view", this.state.vendorsInView);
        // var currentVendorsView = this.state.vendorsInView;
        // var vidIndex = 0;

        // //find location of vid, remove from array of current vendors to render
        // for(let i = 0; i < currentVendorsView.length; i++){
        //   if(currentVendorsView[i] === this.state.vendor){
        //     vidIndex = i;
        //     break;
        //   }
        // }

        // console.log("vid to remove", this.state.vendor);
        // console.log("location of vid", vidIndex);

        // currentVendorsView.splice(Number(vidIndex),1);
        // console.log("new vendors", currentVendorsView);
        // this.props.updateVendorsView(currentVendorsView);
      }

      else{
        this.updateTotal();
      }
    })
  }

  //get cart from server for user
  componentDidMount() {
    //calculate running total of items
    this.updateTotal();
  }

  //render cart items to cart view
  render() {
    //render each item in the cart
    const cart = this.state.cart.map(result => {
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
            notifier = {this.props.notifier}
            updateAfterDelete = {this.props.updateAfterDelete}
            updateCartAfterDelete = {this.updateCartAfterDelete}
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
            notifier = {this.props.notifier}
            updateAfterDelete = {this.props.updateAfterDelete}
            updateCartAfterDelete = {this.updateCartAfterDelete}
          />
        );
      }
    });

    return (
      <div className="cart-table-container">
        {/* TABLE HEADERS */}
        <span className="table-header table-row">
          <span>
            <strong>My Cart ({this.state.cart.length})</strong>
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
          {/* {checkoutButtons} */}

          <Checkout
            cartItems={this.state.cart}
            totalValue={this.state.total}
            notifier={this.props.notifier}
          />
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
