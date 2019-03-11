import React, { Component } from 'react';
import actions from '../../store/actions';
import { connect } from 'react-redux';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import './ShopItemDetailed.css';

class ShopItemDetailed extends Component {
  constructor(props){
    super(props);
    this.state = {
      imageLink: '',
      productInfo: '',
      productName: '',
      productPrice: '',
      amtPurchased: 1,
      vid: '',
      productStock: '',
      isApparel: false
    };
    this.addItem = this.addItem.bind(this);
    this.addQuantity = this.addQuantity.bind(this);
    this.removeQuantity = this.removeQuantity.bind(this);
  }

  //add item to user's cart
  addItem(){
    //check if user is logged in
    if(this.state.login === false){
      alert("please login to add to cart");
    }

    //check if quantity exceeded stock
    else if(this.state.amtPurchased > Number(this.state.productStock) ){
      alert("Quantity exceeded stock amount");
    }

    //add to user's cart
    else{
    //update user's cart on server
      var apiURL = "/api/getUserCart/addItems";
      axios.post(apiURL, {
        params:{
          user: this.props.user,
          pid: this.props.pid,
          amtPurchased: this.state.amtPurchased,
          vendorID: this.state.vid,
          image: this.state.imageLink,
          isApparel: this.state.isApparel,
          s_stock: 0,
          m_stock: 0,
          l_stock: 0,
          xs_stock: 0,
          xl_stock: 0
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
            alert("Item added to cart!");
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
  }

  //increase number of quantity to add to user's cart
  addQuantity(){
    var currentQuantity = this.state.amtPurchased;
    currentQuantity += 1;
    this.setState({
      amtPurchased: currentQuantity
    });
  }

  //remove number of quantity to add to user's cart
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

  //load item info by calling getProductInfo api and render to screen
  componentDidMount(){
    const apiURL = '/api/getProductInfo';
    axios.get(apiURL, {
      params:{
        pid: this.props.pid
      }
    })
    .then(res => {
      //if successfully got product info, update component
      if(res.data.success === true){
        //update state of component
        console.log("checking response for is apparel ", res.data.product);
        if(res.data.product.isApparel === true){
          this.setState({
            productInfo: res.data.product.productInfo,
            productName: res.data.product.productName,
            productPrice: res.data.product.productPrice,
            imageLink: res.data.product.productPicture,
            productStock: res.data.product.productStock,
            vid: res.data.product.vid,
            isApparel: true,
            s_stock: res.data.product.s_stock,
            m_stock: res.data.product.m_stock,
            l_stock: res.data.product.l_stock,
            xs_stock: res.data.product.xs_stock,
            xl_stock: res.data.product.xl_stock
          })
        }
        else{
          this.setState({
            productInfo: res.data.product.productInfo,
            productName: res.data.product.productName,
            productPrice: res.data.product.productPrice,
            imageLink: res.data.product.productPicture,
            productStock: res.data.product.productStock,
            vid: res.data.product.vid,
          })
        }
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
    if(this.state.isApparel === false){
      return (
        <div className = "itemDetailed">        
          <h3> {this.state.productName} </h3>
          <div className = "itemInfo">
            <div id = "imageContainer">
              <img id = "detailedImage" src = {this.state.imageLink[0]}/>
            </div>
  
            <div id = "itemDescriptions">
              <p> <strong> Price: </strong> ${this.state.productPrice} </p>
              <p> <strong> Description:</strong> {this.state.productInfo} </p>
              <p> <strong> Stock:</strong> {this.state.productStock} </p>
              <Button size="small" color="primary" onClick = {this.addItem}>
                Add To Cart
              </Button>
  
              <Button id = "test" onClick = {this.removeQuantity}>
                -
              </Button>
                  
              {this.state.amtPurchased}
                  
              <Button id = "test" onClick = {this.addQuantity}>
                +
              </Button>
            </div>
          </div>
        </div>
      )
    }

    else{
      return(
        <div className = "itemDetailed">        
          <h3> {this.state.productName} </h3>
          <div className = "itemInfo">
            <div id = "imageContainer">
              <img id = "detailedImage" src = {this.state.imageLink[0]}/>
            </div>
  
            <div id = "itemDescriptions">
              <p> <strong> Price: </strong> ${this.state.productPrice} </p>
              <p> <strong> Description:</strong> {this.state.productInfo} </p>
              <p> <strong> Stock:</strong> {this.state.productStock} </p>
              <p> <strong> Small Stock: </strong> {this.state.s_stock} </p>
              <p> <strong> Medium Stock:</strong> {this.state.m_stock} </p>
              <p> <strong> Large Stock:</strong> {this.state.l_stock} </p>
              <p> <strong> X-Small Stock: </strong> {this.state.xs_stock} </p>
              <p> <strong> X-Large Stock:</strong> {this.state.xl_stock} </p>
              <Button size="small" color="primary" onClick = {this.addItem}>
                Add To Cart
              </Button>
  
              <Button id = "test" onClick = {this.removeQuantity}>
                -
              </Button>
                  
              {this.state.amtPurchased}
                  
              <Button id = "test" onClick = {this.addQuantity}>
                +
              </Button>
            </div>
          </div>
        </div>
      )
    }
  }
}

//obtain state from store as props for component
//get login value and user email
const mapStateToProps = state => {
  return{
      pid: state.selectedItem.selectedItemID,
      login: state.auth.login,
      user: state.auth.user
  }
}

//dispatch action to reducer
//update which item was selected for detailed view of item
const mapDispatchToProps = dispatch => {
  return{
      //get user's cart from state after logging in
      updateItems: (response) => dispatch({
        type: actions.GET_CART,
        cart: response
      }),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ShopItemDetailed);
