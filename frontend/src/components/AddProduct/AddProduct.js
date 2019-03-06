import React, { Component } from 'react';
import './AddProduct.css';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

class AddProduct extends Component {
  constructor(props){
    super(props);
    this.state = {
      productName: '',
      productInfo: '',
      productPrice: '',
      stock: ''
    }
    this.addProduct = this.addProduct.bind(this);
  }

  //add product to vendor's collection in database
  addProduct(){
    const apiURL = "/api/adminProducts/addNewProduct";
    axios.post(apiURL, {
      params:{
        vid: this.props.vid,
        user: this.props.user,
        productInfo: this.state.productInfo,
        productName: this.state.productName,
        productPrice: this.state.productPrice,
        stock: this.state.stock
      }
    })
    .then(res => {
      alert(res.data.message);
    })
    .catch(err => {
      alert(err);
    })
  }

  render() {
    return (
      <div>
        <Grid container direction = "column" justify = "center" alignItems = "center">
            <h1> Add Product </h1>
            <div className = "textForm" id="row">
              <TextField
                label="Product Name"
                required="true"
                onChange={(event) => this.setState({ productName: event.target.value })}
              />
            </div>

            <div className = "textForm" id="row">
              <TextField
                label="Product Info"
                required="true"
                onChange={(event) => this.setState({ productInfo: event.target.value })}
              />
            </div>

            <div className = "textForm" id="row">
              <TextField
                label="Product Price"
                required="true"
                onChange={(event) => this.setState({ productPrice: event.target.value })}
              />
            </div>

            <div className = "textForm" id="row">
              <TextField
                label="Product Stock"
                required="true"
                onChange={(event) => this.setState({ stock: event.target.value })}
              />
            </div>

            <Button variant = "contained" color = "primary" onClick = {this.addProduct}> Add Product  </Button>
        </Grid>
      </div>
    )
  }
}

//redux

//obtain state from store as props for component
//get cart items, login value, and user email
const mapStateToProps = state => {
  return{
    items: state.cart.items,
    login: state.auth.login,
    user: state.auth.user,
    vid: state.auth.vendorID
  }
}

export default connect(mapStateToProps, null)(AddProduct);
