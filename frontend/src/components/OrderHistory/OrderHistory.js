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

    };

    this.getOrders = this.getOrders.bind(this);
  }

  getOrders(){
    
  }

  render() {

    return (
      <div>
        <Grid container direction = "column">

        </Grid>
      </div>
    )
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
