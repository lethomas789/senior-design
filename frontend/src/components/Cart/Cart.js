import React, { Component } from 'react';
import './Cart.css';
import axios from 'axios';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import Grid from '@material-ui/core/Grid';
import CartItem from '../CartItem/CartItem';
import Checkout from '../Checkout/Checkout';

//component to display user's cart
class Cart extends Component {
  constructor(props){
    super(props);
  }

  //get cart from server for user
  componentDidMount(){
    //get total from items
    var currentCart = this.props.items;
    var priceTotal = 0;

    //if cart is empty, total price is $0
    if(currentCart.length === 0){
      this.props.updateTotal(priceTotal);
    }

    //if there are items, calculate total price
    else{
      //go through each item in cart and sum up price
      for(let i = 0; i < currentCart.length; i++){
        priceTotal += Number(currentCart[i].totalPrice);
      }
      priceTotal = priceTotal.toFixed(2);
      this.props.updateTotal(priceTotal);
    }
  }

  //render cart items to cart view
  render() {
    const cart = this.props.items.map(result => {
      return <CartItem key = {result.productName} pid = {result.pid} vendorID = {result.vid} productName = {result.productName} amtPurchased = {result.amtPurchased} productPrice = {result.productPrice}  totalPrice = {result.totalPrice} />
    });

    return(
      <div>
        <Grid container direction="row">
          <h1> Current Cart: </h1>
        </Grid>

        <Grid container direction="column" justify-xs-space-evenly>
          <Checkout/>
          {cart}
        </Grid>
      </div>
    );
  }
}

//redux
//dispatch action to reducer, get user's cart
const mapDispatchToProps = dispatch => {
  return{
    updateItems: (response) => dispatch({
      type: actions.GET_CART,
      cart: response
    }),

    //update store of cart total
    updateTotal: (sum) => dispatch({
      type: actions.UPDATE_TOTAL,
      total: sum
    })
  }
}

//obtain state from store as props for component
//get cart items, login value, and user email
const mapStateToProps = state => {
  return{
    items: state.cart.items,
    login: state.auth.login,
    user: state.auth.user
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Cart);
