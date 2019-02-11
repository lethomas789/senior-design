import React, { Component } from 'react';
import './Cart.css';
import axios from 'axios';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import Grid from '@material-ui/core/Grid';
import CartItem from '../CartItem/CartItem';

//component to display user's cart
class Cart extends Component {
  constructor(props){
    super(props);
  }

  //get cart from server for user
  componentDidMount(){
    const apiURL = "http://localhost:4000/api/getUserCart";
    //const apiURL = "http://localhost:4000/api/getAllProducts";

    axios.get(apiURL, {
      params:{
        user: "test2@gmail.com"
      }
    }).then(res => {
        this.props.updateItems(res.data.data);
      })
      .catch(err => {

      })
  }

  render() {

    const cart = this.props.items.map(result => {
      return <CartItem key = {result.productName} productName = {result.productName} amtPurchased = {result.amtPurchased} productPrice = {result.productPrice}  totalPrice = {result.totalPrice} />
    });

    return (
      <div>
        <Grid container direction="row">
          <h1> Current Cart: </h1>
        </Grid>

        <Grid container = {true} direction="row" justify-xs-space-evenly>
          {cart}
        </Grid>
      </div>
    );
  }
}

//redux

//dispatch action to reducer
const mapDispatchToProps = dispatch => {
  return{
    updateItems: (response) => dispatch({
      type: actions.GET_CART,
      cart: response
    })
  }
}

//obtain state from store as props for component
const mapStateToProps = state => {
  return{
    items: state.cart.items,
    login: state.auth.login
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Cart);
