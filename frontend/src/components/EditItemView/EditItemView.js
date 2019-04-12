import React, { Component } from 'react';
import './EditItemView.css';
import EditItem from '../EditItem/EditItem';
import axios from "axios";
import { connect } from "react-redux";
import actions from "../../store/actions";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const style = {
  field: { width: "500px" }
};

class EditItemView extends Component {
  constructor(props){
    super(props);
    this.state = {
      items: [],
      name: '',
      info: '',
      pickupLocation: '',
      stock: '',
      price: '',
      isApparel: false,
      vid: this.props.vendorID,
      pid: '',
      lastUpdate: '',
      lastUser: '',
      user: this.props.user,
      productPicture: [],
      pickupTime: '',
      small: 0,
      medium: 0,
      large: 0,
      xsmall: 0,
      xlarge: 0,
      apparelCSS: "hideApparelSizes",
      itemStockCSS: 'showItemStock'
    };
  }

  //get items of vendor from database
  //allow admin to view and select which item to edit
  componentDidMount() {
    const apiURL = '/api/getVendorProducts';

    //get all products of current vendor based on vendor id
    axios.get(apiURL, {
      params:{
        vid: this.props.vendorID
      }
    })
    .then(res => {
      if(res.data.success === true){
        //update list of items
        this.setState({
          items: res.data.data
        })
      }
      else{
        console.log("error");
      }
    })
    .catch(err =>{
      alert(err);
    })
  }

  //populate edit forms based on which item was selected
  //name parameter finds matching product info in state array of items
  populateEditForm = (name) => {    
    //go through each item in array and determine which item matches
    for(let i = 0; i < this.state.items.length; i++){
      //if matching product, populate form data and state of component
      if (this.state.items[i].productName === name){
        var currentItem = this.state.items[i];
        //if the item selected is not an apparel, do not display apparel sizes
        if(currentItem.isApparel === false){
          this.setState({
            name: name,
            info: currentItem.productInfo,
            price: currentItem.productPrice,
            stock: currentItem.stock,
            pid: currentItem.pid,
            productPicture: currentItem.productPicture,
            isApparel: currentItem.isApparel,
            apparelCSS: 'hideApparelSizes',
            itemStockCSS: 'showItemStock'
          })
        }

        //if the item is an apparel, display and update size stock
        else{
          this.setState({
            name: name,
            info: currentItem.productInfo,
            price: currentItem.productPrice,
            stock: currentItem.stock,
            pid: currentItem.pid,
            productPicture: currentItem.productPicture,
            isApparel: currentItem.isApparel,
            small: currentItem.s_stock,
            medium: currentItem.m_stock,
            large: currentItem.l_stock,
            xsmall: currentItem.xs_stock,
            xlarge: currentItem.xl_stock,
            apparelCSS: 'showApparelSizes',
            itemStockCSS: 'hideItemStock'
          })
        }
      }
    }
  }

  //handle stock change, update total stock values when user changes input
  handleStockChangeApparel = name => stock => {

    //if the user is setting the stock to a negative value, set default to 0
    if(Number(stock.target.value) < 0){
      this.setState({
        [name]: 0
      })
    }

    //if the user presses delete or backspace, handle empty field
    else if(stock.target.value === ''){
      this.setState({
        [name]: ''
      })
    }

    //update stock of current item and update running total of stock items
    else{
      //update stock value for current size
      //after updating current stock, update running total of stock for all sizes
      //callback function called after setState
      this.setState({
        [name]: Number(stock.target.value)
      }, () => {
        //add running total of stocks when value is changed, callback function after state was updated
        var runningStockTotal = 0;
        runningStockTotal = Number(this.state.small) + Number(this.state.medium) + Number(this.state.large) + Number(this.state.xsmall) + Number(this.state.xlarge);
        //update stock with running total
        this.setState({
          stock: String(runningStockTotal)
        })
      })
    }
  };

  //update item info, update information about item in database
  updateItemInfo = () => {
    const apiURL = '/api/adminProducts/editProduct';

    //params for editing item
    axios.patch(apiURL, {
      params:{
        vid: this.state.vid,
        user: this.state.user,
        pid: this.state.pid,
        productInfo: this.state.info,
        productName: this.state.name,
        productPrice: this.state.price,
        stock: this.state.stock,
        productPicture: this.state.productPicture,
        isApparel: this.state.isApparel,
        pickupLocation: this.state.pickupLocation,
        pickupTime: this.state.pickupTime,
        s_stock: Number(this.state.small),
        m_stock: Number(this.state.medium),
        l_stock: Number(this.state.large),
        xs_stock: Number(this.state.xsmall),
        xl_stock: Number(this.state.xlarge)
      }
    })
    .then(res => {
      if(res.data.success === true){
        alert(res.data.message);
      }

      else{
        alert("Error updating item");
      }
    })
    .catch(err => {
      alert(err);
    })
  }// end of updating item
  
  render() {
    //render items to select for editing
    const products = this.state.items.map(result => {
      return <EditItem name = {result.productName} clickFunction = {this.populateEditForm}/>
    });
    
    return (
      <div>
        <Grid container direction = "column" display = "flex" justifyContent = "center" alignItems = "center" >
          <h1> Select Item To Edit </h1>
          <Grid container direction = "row" display = "flex" alignItems = "center" spacing = {24} justify = "space-evenly">
            {products}
          </Grid>

          <Grid container direction = "column" display = "flex" alignItems = "center">
            <div>
              <div className = "textForm" id="row">
                <TextField
                    label="Product Name"
                    required="true"
                    value = {this.state.name}
                    onChange={(event) => this.setState({ name: event.target.value })}
                    style={style.field}
                  />
                </div>

                <div className = "textFormEdit" id="row">
                  <TextField
                    label="Product Info"
                    required="true"
                    multiline={true}
                    rows={2}
                    value = {this.state.info}
                    onChange={(event) => this.setState({ info: event.target.value })}
                    style={style.field}
                  />
                </div>

                <div className = "textFormEdit" id="row">
                  <TextField
                    label="Pickup Location (Enter location and date/time)"
                    required="true"
                    value = {this.state.pickupLocation}
                    onChange={(event) => this.setState({ pickupLocation: event.target.value })}
                    style={style.field}
                  />
                </div>

                <div className = "textFormEdit" id="row">
                  <TextField
                    label="Product Price"
                    required="true"
                    type="number"
                    value = {this.state.price}
                    onChange={(event) => this.setState({ price: event.target.value })}
                  />
                </div>

                <div className = {this.state.itemStockCSS} id="row">
                  <TextField
                    label="Stock"
                    required="true"
                    type="number"
                    value = {this.state.stock}
                    onChange={(event) => this.setState({ stock: event.target.value })}
                  />
                </div>

                {/* add quantity for apparel sizes, toggel visibility if selected */}
                <div className = {this.state.apparelCSS}>
                  <div className = "textForm" id="row">
                    <TextField
                      label="Product Stock"
                      type="number"
                      value = {this.state.stock}
                      disabled
                    />
                  </div>
                  
                  <div className = "textForm" id="row">
                    <TextField
                      label="Small Stock"
                      required="false"
                      type="number"
                      value={this.state.small}
                      onChange={
                        this.handleStockChangeApparel("small")
                      }
                    />
                  </div>

                  <div className = "textForm" id="row">
                    <TextField
                      label="Medium Stock"
                      required="false"
                      type="number"
                      value={this.state.medium}
                      onChange={
                        this.handleStockChangeApparel("medium")
                      }
                    />
                  </div>

                  <div className = "textForm" id="row">
                    <TextField
                      label="Large Stock"
                      required="false"
                      type="number"
                      value={this.state.large}
                      onChange={
                        this.handleStockChangeApparel("large")
                      }
                    />
                  </div>

                  <div className = "textForm" id="row">
                    <TextField
                      label="X-Small Stock"
                      required="false"
                      type="number"
                      value={this.state.xsmall}
                      onChange={                    
                        this.handleStockChangeApparel("xsmall")
                      }
                    />
                  </div>

                  <div className = "textForm" id="row">
                    <TextField
                      label="X-Large Stock"
                      required="false"
                      value={this.state.xlarge}
                      type="number"
                      onChange={
                        this.handleStockChangeApparel("xlarge")
                      }
                    />
                  </div>
                </div>

                <Button 
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick = {this.updateItemInfo}> 
                  Update Item 
                </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }
}

//redux, pass as vid and username from redux store to use in component
const mapStateToProps = state => {
  return {
    user: state.auth.user,
    vendorID: state.auth.vendorID
  };
};

export default connect(
  mapStateToProps,
  null
)(EditItemView);
