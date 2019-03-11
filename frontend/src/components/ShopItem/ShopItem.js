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
import {Link} from 'react-router-dom';

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
      vendorID: this.props.vendorID,
      open: false,
      alertMessage: '',
      imageLink: this.props.imageSrc
    }

    //bind functions to component
    this.addItem = this.addItem.bind(this);
    this.addQuantity = this.addQuantity.bind(this);
    this.removeQuantity = this.removeQuantity.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.updateVendor = this.updateVendor.bind(this);
    this.showDetailed = this.showDetailed.bind(this);
  }

  //handle dialog closing
  handleClose(){
    this.setState({
        open: false
    })
  }

  //update vendor in redux store
  updateVendor(){
    var viewVendor = this.state.vendorID;
    console.log("trying to update vendor ", viewVendor);
    this.props.updateVendor(viewVendor);
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
      var apiURL = "/api/getUserCart/addItems";
      axios.post(apiURL, {
        params:{
          user: this.props.user,
          pid: this.state.pid,
          amtPurchased: this.state.amtPurchased,
          vendorID: this.state.vendorID,
          image: this.state.imageLink
        }
      })
      .then(res => {
        if(res.data.success === true){
          //after adding to item, get updated cart
          const getCartURL = "/api/getUserCart";
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

  //show detailed info of item, reroute
  showDetailed(){
    //update which item was selected for detialed view
    this.props.updateSelectedItem(this.state.pid);
    // this.props.history.push('/itemDetails');
  }

  render() {
    return (
      <Grid item xs = {4} spacing = {2}>
      <div onClick = {this.showDetailed} className = "centerPage">
     
        <div className = "box">
          <div className = "center">
        {/* <img src={require('../../images/test_shirt1.png')} width="100%" height="100%"/> */}
        <img src={this.props.imageSrc}  width="100%" height="100%"/>

      
        </div>
        </div>
      {/* <Card id = "background" className = "smallCard">
      <CardContent> */}
                {/* <Typography gutterBottom variant="h5" component="h2"> */}
                <div className = "resizing">
               <h5>
                  {this.props.productName}
                  </h5>
                {/* </Typography> */}
                
                <p>
               
                ${this.props.productPrice}
                
                {/* Stock: {this.props.stock} */}
                
                {/* Info: {this.props.productInfo} */}

                {/* <Button id = "test" onClick = {this.removeQuantity}>
                 -
                </Button>
                
               {this.state.amtPurchased}
                
                 <Button id = "test" onClick = {this.addQuantity}>
                  +
                 </Button> */}
              

          <Button size="small" color="primary" onClick = {this.addItem}>
              Add To Cart
             </Button>

             <Button size="small" color="primary" onClick = {this.updateVendor}>
             <Link to = "/vendorProducts"> More From Vendor </Link>
               </Button>
               
               </p>
               </div>
              {/* </CardContent>
      </Card> */}
      </div>
      </Grid>

        // <Grid item xs = {4} spacing = {2}> 
        // {/* <Grid container item xs={12} spacing={24}></Grid> */}
        //   <Card className= "card">
        //     <CardActionArea>
        //       <CardMedia className = "media" />
        //       <div className="resize">
        //       <img src={require('../../images/test_shirt1.png')} width="60%" height="60%"/>
        //       </div>
        //       {/* <img src = {test}/> */}
        //       <CardContent>
        //         {/* <Typography gutterBottom variant="h5" component="h2"> */}
        //        <h5>
        //           {this.props.productName}
        //           </h5>
        //         {/* </Typography> */}
        //         <Typography component="p">
        //           Price: ${this.props.productPrice}
        //         </Typography>
        //         <Typography component="p">
        //           Stock: {this.props.stock}
        //         </Typography>
        //         <Typography component="p">
        //           Info: {this.props.productInfo}
        //         </Typography>
        //       </CardContent>
        //     </CardActionArea>
        //     <CardActions>
        //         <Button id = "test" onClick = {this.removeQuantity}>
        //          -
        //         </Button>
        //         <div className= "quantity">
        //         {this.state.amtPurchased}
        //         </div>
        //         <Button id = "test" onClick = {this.addQuantity}>
        //          +
        //         </Button>
              

        //       <Button size="small" color="primary" onClick = {this.addItem}>
        //         Add To Cart
        //       </Button>

        //       <Button size="small" color="primary" onClick = {this.updateVendor}>
        //         <Link to = "/vendorProducts"> More From Vendor </Link>
        //       </Button>

        //       <Dialog open = {this.state.open} onClose = {this.handleClose} aria-describedby = "alert-dialog-description">
        //         <DialogContent>
        //           <DialogContentText id = "alert-dialog-description">
        //             {this.state.alertMessage}
        //           </DialogContentText>
        //         </DialogContent>
        //         <DialogActions>
        //           <Button onClick = {this.handleClose} color = "primary">
        //             Ok
        //           </Button>
        //         </DialogActions>
        //       </Dialog>
        //     </CardActions>
        //   </Card>
        // </Grid>
    
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
      }),

      updateVendor: (newVendor) => dispatch({
        type: actions.GET_VENDOR_PRODUCTS,
        vendor: newVendor
      }),

      updateSelectedItem: (pid) => dispatch({
        type: actions.UPDATE_SELECTED_ITEM,
        itemID: pid
      })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopItem);
