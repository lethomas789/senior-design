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
import AddCircle from '@material-ui/icons/Add';
import RemoveCircle from '@material-ui/icons/Remove';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { DialogActions } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

//component to display product info
class ShopItem extends Component {
  constructor(props){
    super(props);

    //initial state of products
    this.state = {
      name: this.props.productName,
      price: this.props.productPrice,
      pid: this.props.pid,
      amtPurchased: 1,
      open: false,
      alertMessage: ''
    }

    //bind functions to component
    this.addItem = this.addItem.bind(this);
    this.addQuantity = this.addQuantity.bind(this);
    this.removeQuantity = this.removeQuantity.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  //handle dialog closing
  handleClose(){
    this.setState({
        open: false
    })
  }

  //function to update cart of user
  //add item to user's cart
  addItem(){
    //check if user is logged in
    //only allow user to add to cart if logged in
    if(this.props.login === false){
      this.setState({
        open: true,
        alertMessage: "Please login to add to cart!"
      })
    }

    else{
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
          //after adding to item, get updated cart
          const getCartURL = "http://localhost:4000/api/getUserCart";
          axios.get(getCartURL, {
            params:{
              user: this.props.user
            }
          })
          .then(res => {
            //after getting cart info, update redux store container
            this.props.updateItems(res.data.data);
            this.setState({
              open: true,
              alertMessage: "Item added to cart!"
            });
          })
          .catch(err => {
            alert(err);
          })
        }
      })
      .catch(err => {
        alert(err);
      })
    }
  } //end of add item

  //add quantity purchased
  addQuantity(){
    var currentQuantity = this.state.amtPurchased;
    currentQuantity += 1;
    this.setState({
      amtPurchased: currentQuantity
    });
  }

  //remove quantity purchased
  removeQuantity(){
    var currentQuantity = this.state.amtPurchased;
    //can't have negative amount of items selected
    if(currentQuantity <= 1){
      alert("Must have at least one item");
    }

    else{
      currentQuantity -= 1;
      this.setState({
        amtPurchased: currentQuantity
      });
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
              <Typography variant = "h6">
                <Fab size = "small" aria-label = "Remove" onClick = {this.removeQuantity}>
                  <RemoveCircle/>
                </Fab>
                Quantity: {this.state.amtPurchased}
                <Fab size = "small" aria-label = "Add" onClick = {this.addQuantity}>
                  <AddCircle/>
                </Fab>
              </Typography>

              <Button size="small" color="primary" onClick = {this.addItem}>
                Add To Cart
              </Button>

              <Button size="small" color="primary">
                Learn More
              </Button>

              <Dialog open = {this.state.open} onClose = {this.handleClose} aria-describedby = "alert-dialog-description">
                <DialogContent>
                  <DialogContentText id = "alert-dialog-description">
                    {this.state.alertMessage}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick = {this.handleClose} color = "primary">
                    Ok
                  </Button>
                </DialogActions>
              </Dialog>
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
      //get user's cart from state after logging in
      updateItems: (response) => dispatch({
        type: actions.GET_CART,
        cart: response
      })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopItem);
