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

    //if user is logged in, get cart info
    if (this.props.login === true){
      axios.get(apiURL,{
        params:{
          user: this.props.user
        }
      }).then(res => {
          this.props.updateItems(res.data.data);
        })
        .catch(err => {
          alert(err);
        })
    }
  }

  render() {
    const cart = this.props.items.map(result => {
      return <CartItem key = {result.productName} pid = {result.pid} productName = {result.productName} amtPurchased = {result.amtPurchased} productPrice = {result.productPrice}  totalPrice = {result.totalPrice} />
    });

    return(
      <div>
        <Grid container direction="row">
          <h1> Current Cart: </h1>
        </Grid>

        <Grid container direction="column" justify-xs-space-evenly>
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
//get cart items, login value, and user email
const mapStateToProps = state => {
  return{
    items: state.cart.items,
    login: state.auth.login,
    user: state.auth.user
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Cart);
