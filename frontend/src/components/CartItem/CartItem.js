import React, { Component } from 'react';
import axios from 'axios';
import './CartItem.css';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import actions from '../../store/actions';

//component to display cart objects
class CartItem extends Component {
  constructor(props){
    super(props);
    //store product id PID to reference for item removal
    this.state = {
      pid: this.props.pid,
      vid: this.props.vendorID,
      size: this.props.size
    }
    this.removeItem = this.removeItem.bind(this);
  }

  //remove item from user's cart
  removeItem(){
    const apiURL = "/api/getUserCart/deleteItems";
    axios.post(apiURL, {
      params:{
        user: this.props.user,
        pid: this.state.pid
      }
    })
    .then(res => {
      const getCart = "/api/getUserCart";
      //after successful deletion, get updated user's cart
      axios.get(getCart, {
        params:{
          user: this.props.user
        }
      })
      .then(res => {
        //after removing item from cart, update cart on server
        this.props.updateItems(res.data.data);
        //get total from items
        var currentCart = res.data.data;
        var priceTotal = 0;
        
        //if cart is empty, total price is $0
        if(currentCart.length === 0){
          console.log("cart is empty");
          this.props.updateTotal(priceTotal);
        }

        //if there are items, calculate total price
        else{
          console.log("cart is not empty");
          for(let i = 0; i < currentCart.length; i++){
            priceTotal += Number(currentCart[i].totalPrice);
          }
          console.log(priceTotal);
          this.props.updateTotal(priceTotal);
        }
      })
      .catch(err => {
        alert(err);
      })
    })
    .catch(err => {
      alert(err);
    })
  }

  render() {
    //non apparel cart item
    if(this.props.size === undefined){
      return (
        <Grid item xs>
          <Card className= "card">
            <CardActionArea>
              <img src={this.props.imageSrc} width="100%" height="100%"/>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {this.props.productName}
                </Typography>
                <Typography gutterBottom variant="h5" component="h2">
                  Amount: {this.props.amtPurchased}
                </Typography>
                <Typography gutterBottom variant="h5" component="h2">
                  Price: ${this.props.productPrice}
                </Typography>
                <Typography gutterBottom variant="h5" component="h2">
                  Total Price: ${this.props.totalPrice}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary" onClick = {this.removeItem}>
                Remove Item
              </Button>
              <Button size="small" color="primary">
                Add Item
              </Button>
            </CardActions>
          </Card>
        </Grid>
      )
    }

    //return cart item description for apparel
    else{
      return (
        <Grid item xs>
          <Card className= "card">
            <CardActionArea>
              <img src={this.props.imageSrc} width="100%" height="100%"/>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {this.props.productName}
                </Typography>
                <Typography gutterBottom variant="h5" component="h2">
                  Amount: {this.props.amtPurchased}
                </Typography>
                <Typography gutterBottom variant="h5" component="h2">
                  Size: {this.props.size}
                </Typography>
                <Typography gutterBottom variant="h5" component="h2">
                  Price: ${this.props.productPrice}
                </Typography>
                <Typography gutterBottom variant="h5" component="h2">
                  Total Price: ${this.props.totalPrice}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary" onClick = {this.removeItem}>
                Remove Item
              </Button>
              <Button size="small" color="primary">
                Add Item
              </Button>
            </CardActions>
          </Card>
        </Grid>
      )
    }
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

//redux
//dispatch action to reducer, get user's cart from store
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

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);
