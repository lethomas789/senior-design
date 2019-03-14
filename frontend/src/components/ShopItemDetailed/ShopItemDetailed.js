import React, { Component } from 'react';
import actions from '../../store/actions';
import { connect } from 'react-redux';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import './ShopItemDetailed.css';
import ReactImageMagnify from 'react-image-magnify';

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
      isApparel: false,
      s_stock: 0,
      m_stock: 0,
      l_stock: 0,
      xs_stock: 0,
      xl_stock: 0,
      size: '',
      currentImage: 0
    };
    this.addItem = this.addItem.bind(this);
    this.addQuantity = this.addQuantity.bind(this);
    this.removeQuantity = this.removeQuantity.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.nextImage = this.nextImage.bind(this);
    this.prevImage = this.prevImage.bind(this);
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
      //item added to user's cart is not an apparel
      if(this.state.isApparel === false){
        axios.post(apiURL, {
          params:{
            user: this.props.user,
            pid: this.props.pid,
            amtPurchased: this.state.amtPurchased,
            vendorID: this.state.vid,
            image: this.state.imageLink,
            isApparel: this.state.isApparel,
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

      //item added to user's cart is an apparel
      else{
        console.log("checking shirt size", this.state.size);
        axios.post(apiURL, {
          params:{
            user: this.props.user,
            pid: this.props.pid,
            amtPurchased: this.state.amtPurchased,
            vendorID: this.state.vid,
            image: this.state.imageLink,
            isApparel: this.state.isApparel,
            s_stock: this.state.s_stock,
            m_stock: this.state.m_stock,
            l_stock: this.state.l_stock,
            xs_stock: this.state.xs_stock,
            xl_stock: this.state.xl_stock,
            size: this.state.size
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
      } //end of else statement for isApparel
    } //end of else statement for adding to user's cart
  } //end of addItem function

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

  //handle select when user selects shirt size
  handleSelect(){
    this.setState({
      size: this.selectedSize.value
    })
  }

  //view next image, increment index in image array
  nextImage(){
    if(this.state.currentImage < this.state.imageLink.length-1){
      this.setState({
        currentImage: this.state.currentImage + 1
      })
    }
  }

  //previous image, decrement index in image array
  prevImage(){
    if(this.state.currentImage > 0){
      this.setState({
        currentImage: this.state.currentImage - 1
      })
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
            xl_stock: res.data.product.xl_stock,
            size: res.data.product.size
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
            <div className = "imageMagnifyContainer">
            
              <ReactImageMagnify {...{
                    smallImage: {
                        alt: 'Test Image',
                        width:300,
                        height:300,
                        src: this.state.imageLink[this.state.currentImage]
                    },
                    largeImage: {
                        src: this.state.imageLink[this.state.currentImage],
                        width: 600,
                        height: 900,
                        enlargedImagePosition: 'beside'
                    }
                }}/>

              <div className = "imageButtons">
                  <button onClick = {this.prevImage} id = "prevImage" > Previous </button>
                  <button onClick = {this.nextImage} id = "nextImage"> Next </button>
              </div>

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
            <div className = "imageMagnifyContainer">

              <ReactImageMagnify {...{
                  smallImage: {
                      alt: 'Test Image',
                      width:300,
                      height:300,
                      src: this.state.imageLink[this.state.currentImage]
                  },
                  largeImage: {
                      src: this.state.imageLink[this.state.currentImage],
                      width: 600,
                      height: 900,
                      enlargedImagePosition: 'beside'
                  }
              }}/>

              <div className = "imageButtons">
                  <button onClick = {this.prevImage} id = "prevImage" > Previous </button>
                  <button onClick = {this.nextImage} id = "nextImage"> Next </button>
              </div>

            </div>
            
            <div id = "itemDescriptions">
              <p> <strong> Price: </strong> ${this.state.productPrice} </p>
              <p> <strong> Description:</strong> {this.state.productInfo} </p>
              <div id = "selectShirtSize">
                <p> <strong> Select Size: </strong> </p>
                <select onChange = {this.handleSelect} ref = {select => {this.selectedSize = select}}>
                  <option value = "select"> Select </option>
                  <option value = "Small"> Small </option>
                  <option value = "Medium"> Medium </option>
                  <option value = "Large"> Large </option>
                  <option value = "X-Small"> X-Small </option>
                  <option value = "X-Large"> X-Large </option>
                </select>
              </div>
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
