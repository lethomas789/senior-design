import React, { Component } from 'react';
import './ShopView.css';
import ShopItem from '../ShopItem/ShopItem';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { connect } from 'react-redux';
import actions from '../../store/actions';

class ShopView extends Component {
  constructor(props){
    super(props);
  }

  //get products from server after mounting to screen
  componentDidMount(){
    const apiURL = "http://localhost:4000/api/getAllProducts";
    // const apiURL = "http://localhost:4000/api/getAllProducts";

    //get all products from server
    //update state of view to obtain items
    axios.get(apiURL)
      .then(res => {
        //update product state in redux store
        console.log(res.data);
        this.props.updateProducts(res.data.data);
      })
      .catch(err => {
        alert("Server error retrieving items");
      })
  }

  render() {
    const items = this.props.products.map(result => {
      return <ShopItem key = {result.pid} pid = {result.pid} productName = {result.productName} productPrice = {result.productPrice} stock = {result.stock} productInfo = {result.productInfo} />
    });

    return (
      <div className = "grow">
        <Grid container direction="column" justify="center"alignContent = "center" alignItems="center">
          <h1> Shop </h1>
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
      products: state.getAllItems.products
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopView);