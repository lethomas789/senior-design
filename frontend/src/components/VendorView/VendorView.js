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
      products: [],
      vendorName: '',
      bio: ''
    }
  }

  componentDidMount(){
    const apiURL = "/api/getVendorProducts";
    axios.get(apiURL, {
      params:{
        vendor: this.props.vendor
      }
    })
    .then(res => {
      console.log("getting vendor products ", res.data);

      var currentVendorName = '';
      var currentVendorBio = '';

      //search for matching vendor id in array of vendors of redux store
      for(let i = 0; i < this.props.vendors.length; i++){
        if(this.props.vendors[i].vid === this.props.vendor){
          //update component state, list of products from vendor
          this.setState({
            products: res.data.data,
            vendorName: this.props.vendors[i].vendorName,
            bio: this.props.vendors[i].bio
          });
          break;
        }
      }
    })
  }

  render() {
    const items = this.state.products.map(result => {
      return <ShopItem key = {result.pid} vendorID = {result.vid} pid = {result.pid} productName = {result.productName} productPrice = {result.productPrice} stock = {result.stock} productInfo = {result.productInfo} />
    });

    return (
      <div className = "grow">
        <Grid container direction="column" justify="center"alignContent = "center" alignItems="center">
          <h1> {this.state.vendorName} </h1>
          <h3> Bio: {this.state.bio} </h3>
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
    vendor: state.vendor.vendor,
    vendors: state.vendor.vendors
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VendorView);
