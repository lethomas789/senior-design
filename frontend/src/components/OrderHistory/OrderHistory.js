import React, { Component } from 'react';
import './OrderHistory.css';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import OrderHistoryItem from '../OrderHistoryItem/OrderHistoryItem.js';

class OrderHistory extends Component {
  constructor(props){
    super(props);
    this.state = {
      orders: []
    };
  }

  componentDidMount(){
    const apiURL = "http://localhost:4000/api/orders/getUserOrders";

    axios.get(apiURL, {
      params:{
        user: this.props.user
      }
    })
    .then(res => {
      if(res.data.success === true){
        this.setState({
          orders: res.data.orders
        });
      }

      else{
        alert(res.data.message);
      }
    })
    .catch(err => {
      alert(err);
    })
  }

  render() {
    const orders = this.state.orders.map(order => {
      // let convertDate = new Date(order.date);
      // convertDate = convertDate.format("dd.mm.yyy HH:MM:ss");
      return <OrderHistoryItem orderDate = {order.date} email = {order.email} firstName = {order.firstName} 
            lastName = {order.lastName} oid = {order.oid} paid = {String(order.paid)} pickedUp = {String(order.pickedUp)}
            totalPrice = {order.totalPrice} 
            />
    });


    if(this.state.orders.length === 0){
      return(
        <div>
          <h1> No orders were made! </h1>
        </div>
      );
    }

    else{
      return (
        <div>
          <h1> Orders: </h1>
          <Grid container direction = "column">
            {orders}
          </Grid>
        </div>
      );
    }
  }
}

//obtain state from store as props for component
//get cart items, login value, and user email
const mapStateToProps = state => {
  return{
    items: state.cart.items,
    login: state.auth.login,
    user: state.auth.user,
    total: state.cart.total,
    cart: state.cart.items
  }
}

//redux
//dispatch action to reducer, get user's cart from store
const mapDispatchToProps = dispatch => {
  return{
    updateItems: (response) => dispatch({
      type: actions.GET_CART,
      cart: response
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistory);
