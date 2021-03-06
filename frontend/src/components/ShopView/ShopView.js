import React, { Component } from 'react';
import './ShopView.css';
import ShopItem from '../ShopItem/ShopItem';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import { banner } from '../../images/generic_club.jpg';

class ShopView extends Component {
  constructor(props){
    super(props);
  }

  //get products from server after mounting to screen
  componentDidMount(){
    //const apiURL = "http://localhost:4000/api/getAllProducts";
    const apiURL = "/api/getAllProducts";
    //get all products from server
    //update state of view to obtain items
    axios.get(apiURL)
      .then(res => {
        //update product state in redux store
        console.log(res.data);
        this.props.updateProducts(res.data.data);

        //after getting products, get list of vendors
        const vendorsURL = "/api/getVendorInfo";
        axios.get(vendorsURL)
          .then(res => {
            console.log(res.data);
            this.props.updateVendors(res.data.vendors);
          })
          .catch(err => {
            alert("error getting vendors");
          })
      })
      .catch(err => {
        alert("Server error retrieving items");
      })
  }

  render() {
    const items = this.props.products.map(result => {
      return <ShopItem key = {result.pid} imageSrc = {result.productPicture[0]} vendorID = {result.vid} pid = {result.pid} productName = {result.productName} productPrice = {result.productPrice} stock = {result.stock} productInfo = {result.productInfo} />
    });

    return (
      <div className = "grow">
         <Grid container direction = "column" display= "flex"  justifyContent= "center" alignItems="center" height= "100vh">
        {/* <Grid container direction="column" justify="center"alignContent = "center" alignItems="center"> */}
          <h1> Shop </h1>    
          <div className = "container">     
          <div className = "hero-image">
          <img src={require('../../images/more_treats.jpg')} width="100%" height="100%"/>
          </div>
          <div class="hero-text">
          UCD CLUBS
          </div>
          </div> 
        </Grid>
        
        <Grid container direction = "row" display= "flex"  justifyContent= "center" alignItems="center" height= "100vh" justify-xs-space-evenly>

        {/* <Grid container spacing={24} direction="row" justify="flex-start" alignItems="center" justify-xs-space-evenly> */}
          {items}
        </Grid>
      </div>
    )
  }
}

//redux

//dispatch action to reducer
//update items from server to become state of store
const mapDispatchToProps = dispatch => {
  return{
      updateProducts: (products) => dispatch({
          type: actions.GET_PRODUCTS,
          items: products
      }),

      updateVendors: (currentVendors) => dispatch({
        type: actions.GET_VENDORS,
        vendors: currentVendors
      })
  }
}

//get items from products state of store
//obtain state from store as props for component
const mapStateToProps = state => {
  return{
      products: state.getAllItems.products
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopView);
