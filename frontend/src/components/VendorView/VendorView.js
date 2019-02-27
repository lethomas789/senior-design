import React, { Component } from 'react';
import './VendorView.css';
import axios from 'axios';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import ShopItem from '../ShopItem/ShopItem';
import Grid from '@material-ui/core/Grid';

class VendorView extends Component {
  constructor(props){
    super(props);
    this.state = {
      products: []
    }
  }

  componentDidMount(){
    const apiURL = "http://localhost:4000/api/getVendorProducts";
    axios.get(apiURL, {
      params:{
        vendor: this.props.vendor
      }
    })
    .then(res => {
      console.log("getting vendor products ", res.data);
      //update component state, list of products from vendor
      this.setState({
        products: res.data.data
      })
    })
  }

  render() {
    const items = this.state.products.map(result => {
      return <ShopItem key = {result.pid} vendorID = {result.vid} pid = {result.pid} productName = {result.productName} productPrice = {result.productPrice} stock = {result.stock} productInfo = {result.productInfo} />
    });

    return (
      <div className = "grow">
        <Grid container direction="column" justify="center"alignContent = "center" alignItems="center">
          <h1> Vendor Items </h1>
        </Grid>

        <Grid container spacing={24} direction="row" justify="center" alignItems="center" justify-xs-space-evenly>
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
      })
  }
}

//get items from products state of store
//obtain state from store as props for component
const mapStateToProps = state => {
  return{
    vendor: state.vendor.vendor
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VendorView);
