import React, { Component } from 'react';
import './Checkout.css';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import actions from '../../store/actions';


//calculate total price of user's cart and allow user to checkout
//get user's cart info from state
class Checkout extends Component {
  constructor(props){
    super(props);
  }

  //calculate total from user's cart
  // componentDidMount(){
  //   //get total from items
  //   var currentCart = this.props.items;
  //   var priceTotal = 0;

  //   //if cart is empty, total price is $0
  //   if(currentCart.length === 0){
  //     this.setState({
  //       total: 0
  //     })
  //   }

  //   //if there are items, calculate price
  //   else{
  //     for(let i = 0; i < currentCart.length; i++){
  //       priceTotal += Number(currentCart[i].totalPrice);
  //     }
  
  //     this.setState({
  //       total: priceTotal
  //     })
  //   }
  // }

  render() {
    return (
      <div>
        <Grid container direction="row">
          <h1> Total: ${this.props.total} </h1>
          <Button> Checkout </Button>
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
    total: state.cart.total
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

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
