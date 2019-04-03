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
      total: 0
    };
  }

  //get cart from server for user
  componentDidMount() {
    //get total from items
    var currentCart = this.props.items;
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
    }
  }

  //render cart items to cart view
  render() {
    const cart = this.props.items.map(result => {
      console.log('result in cart:', result);
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
          />
        );
      }
    });

    return (
      <div className="cart-container">
        {/* TABLE HEADERS */}
        <span className="table-header table-row">
          <span>
            <strong>My Cart</strong>
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
        <div className="table-row">
          <span>test</span>
          <span>test</span>
          <span>test</span>
          <span>test</span>
        </div>

        <div className="table-row">
          <span>test</span>
          <span>test</span>
          <span>test</span>
          <span>test</span>
        </div>

        {cart}
      </div>
      /*
      <div className="table-container">
        <table className="table">
          <tr className="table-header">
            <th>My Cart</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
          <tr>
            <td>test</td>
            <td>test</td>
            <td>test</td>
            <td>test</td>
          </tr>
          <tr>
            <td>test</td>
            <td>test</td>
            <td>test</td>
            <td>test</td>
          </tr>
        </table>
      </div>
      */
    );

    /*
    //render items in cart
    if (this.props.items.length > 0){
      //map each entry in item array to render a component
      const cart = this.props.items.map(result => {
        if (result.size === undefined){
          return <CartItem key = {result.productName} imageSrc = {result.imageLink} pid = {result.pid} vendorID = {result.vid} productName = {result.productName} amtPurchased = {result.amtPurchased} productPrice = {result.productPrice}  totalPrice = {result.totalPrice} />
        }
        else{
          return <CartItem key = {result.productName} size  = {result.size} imageSrc = {result.imageLink} pid = {result.pid} vendorID = {result.vid} productName = {result.productName} amtPurchased = {result.amtPurchased} productPrice = {result.productPrice}  totalPrice = {result.totalPrice} />
        }
      });

      return(
        <div>
          <Grid container direction="column">
            <h1> <Link to = "/orderHistory"> Order History </Link> </h1>
            <h1> Current Cart: </h1>
          </Grid>
  
          <Grid container direction="column" justify-xs-space-evenly>
            <Checkout total = {this.state.total}/>
            {cart}
          </Grid>
        </div>
      );
    }

    //empty cart case
    else{
      return(
        <div>
          <Grid container direction="column">
            <h1> <Link to = "/orderHistory"> Order History </Link> </h1>
            <h1> Current Cart: </h1>
          </Grid>
  
          <Grid container direction="column" justify-xs-space-evenly>
            <Checkout total = {this.state.total}/>
          </Grid>
        </div>
      );
    }
    */
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
