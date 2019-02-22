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
    this.state = {
      pid: this.props.pid
    }
    this.removeItem = this.removeItem.bind(this);
  }

  //remove item from user's cart
  removeItem(){
    const apiURL = "http://localhost:4000/api/getUserCart/deleteItems";
    axios.post(apiURL, {
      params:{
        user: this.props.user,
        pid: this.state.pid
      }
    })
    .then(res => {
      const getCart = "http://localhost:4000/api/getUserCart";
      //after successful deletion, get updated user's cart
      axios.get(getCart, {
        params:{
          user: this.props.user
        }
      })
      .then(res => {
        //update cart
        this.props.updateItems(res.data.data);
      })
      .catch(err => {

      })
    })
    .catch(err => {

    })
  }

  render() {
    return (
      <Grid item xs>
        <Card className= "card">
          <CardActionArea>
            <CardMedia className = "media"/>
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
//dispatch action to reducer
const mapDispatchToProps = dispatch => {
  return{
    updateItems: (response) => dispatch({
      type: actions.GET_CART,
      cart: response
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);
