import React, { Component } from 'react';
import './ShopItem.css';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import actions from '../../store/actions';
import { connect } from 'react-redux';
import axios from 'axios';

//component to display product info
class ShopItem extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: this.props.productName,
      price: this.props.productPrice,
      pid: this.props.pid,
      amtPurchased: 1
    }
    this.addItem = this.addItem.bind(this);
  }

  //function to update cart of user
  //add item to user's cart
  addItem(){
    //check if user is logged in
    //only allow user to add to cart if logged in
    if(this.props.login === false){
      alert("Please login to add to cart");
    }

    else{
      //create cart item to add to cart
      //TODO fix amtPurchased
      var itemObject = {
        pid: this.state.pid,
        productName: this.state.name,
        productPrice: this.state.price,
        amtPurchased: 1
      }
      //add to cart of redux state
      this.props.addToCart(itemObject);

      //update user's cart on server
      var apiURL = "http://localhost:4000/api/getUserCart/addItems";
      axios.post(apiURL, {
        params:{
          user: this.props.user,
          pid: this.state.pid,
          amtPurchased: this.state.amtPurchased
        }
      })
      .then(res => {
        if(res.data.success === true){
          alert("Item added to cart!");
        }
      })
      .catch(err => {
        alert(err);
      })
    }
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
                  Price: ${this.props.productPrice}
                </Typography>
                <Typography gutterBottom variant="h5" component="h2">
                  Stock: {this.props.stock}
                </Typography>
                <Typography component="p">
                  Info: {this.props.productInfo}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary" onClick = {this.addItem}>
                Add To Cart
              </Button>
              <Button size="small" color="primary">
                Learn More
              </Button>
            </CardActions>
          </Card>
        </Grid>
    )
  }
}

//obtain state from store as props for component

//get login value and user email
const mapStateToProps = state => {
  return{
      user: state.auth.user,
      login: state.auth.login
  }
}


//dispatch action to reducer

//update redux state of current cart
const mapDispatchToProps = dispatch => {
  return{
      addToCart: (addedItem) => dispatch({
          type: actions.ADD_CART,
          item: addedItem
      })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopItem);
