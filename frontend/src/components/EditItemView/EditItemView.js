import React, { Component } from 'react';
import './EditItemView.css';
import EditItem from '../EditItem/EditItem';
import axios from "axios";
import { connect } from "react-redux";
import actions from "../../store/actions";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FileUploader from 'react-firebase-file-uploader';

import firebase from 'firebase';
// import firebaseConfig from '../../config/ecs193-ecommerce-firebase-adminsdk-7iy3n-f581d24562.json';

//config file for firebase
// const config = {
//   apiKey: firebaseConfig.private_key,
//   authDomain: "ecs193-ecommerce.firebaseapp.com",
//   databaseURL: "https://ecs193-ecommerce.firebaseio.com",
//   storageBucket: "ecs193-ecommerce.appspot.com"
// };

// firebase.initializeApp(config);

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
      itemStockCSS: 'showItemStock',
      images: [],
      imageNames:[],
      newImages: false
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
        this.props.notifier({
          title: "Error",
          message: "Error getting items",
          type: "danger"
        });
      }
    })
    .catch(err =>{
      this.props.notifier({
        title: "Error",
        message: err.toString(),
        type: "danger"
      });
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

  //upload images to database
  //upload each image in array to database
  uploadFiles = () => {
    //for each file in images array, upload to database
    const files = this.state.images;
    files.forEach(file => {
      this.fileUploader.startUpload(file);
    });
  }

  //detects when an image is uploaded from user
  //change number of files to upload
  //same function from AddProduct
  handleFileChange = (event) => {
    //extract file from upload component
    const { target: { files } } = event;

    //store image names
    // const filesToStore = [];
    const filesToStore = this.state.imageNames;

    //store actual image files
    // const actualImages = [];
    const actualImages = this.state.images;

    //store image name as an object
    let imageName = {};
    imageName.name = files[0].name;

    //push values to arrays
    filesToStore.push(imageName);
    actualImages.push(files[0]);

    // console.log("files to store", imageName);
    // console.log("actual images", actualImages);
    
    //set state of component
    this.setState({
      images: actualImages,
      imageNames: filesToStore
    });
  };

  //update item info, update information about item in database
  updateItemInfo = () => {
    const apiURL = '/api/adminProducts/editProduct';
    var imagesToUpload;
    var newImages = false;

    //if the admin did not upload anymore pictures, use old array
    if(this.state.imageNames.length === 0){
      imagesToUpload = this.state.productPicture;
      // console.log("uploading old pictures");
    }

    //if admin updated new pictures, send new array
    else{
      // console.log("updating new pictures");
      imagesToUpload = this.state.imageNames;
      newImages = true;
    }

    //params for editing item
    axios.patch(apiURL, {
      withCredentials: true,
      params:{
        vid: this.state.vid,
        // user: this.state.user,
        pid: this.state.pid,
        productInfo: this.state.info,
        productName: this.state.name,
        productPrice: this.state.price,
        stock: this.state.stock,
        productPicture: imagesToUpload,
        isApparel: this.state.isApparel,
        pickupLocation: this.state.pickupLocation,
        pickupTime: this.state.pickupTime,
        s_stock: Number(this.state.small),
        m_stock: Number(this.state.medium),
        l_stock: Number(this.state.large),
        xs_stock: Number(this.state.xsmall),
        xl_stock: Number(this.state.xlarge),
        newImages: newImages
      }
    })

    .then(res => {
      if(res.data.success === true && this.state.imageNames.length != 0){
        this.uploadFiles();
        this.props.notifier({
          title: "Success",
          message: res.data.message.toString(),
          type: "success"
        });
      }

      else if(res.data.success === true){
        this.props.notifier({
          title: "Success",
          message: res.data.message.toString(),
          type: "success"
        });
      }

      else{
        this.props.notifier({
          title: "Error",
          message: "Error updating item",
          type: "danger"
        });
      }
    })
    .catch(err => {
      this.props.notifier({
        title: "Error",
        message: err.toString(),
        type: "danger"
      });
    })
  }// end of updating item
  
  render() {
    //render items to select for editing
    const products = this.state.items.map(result => {
      return <EditItem name = {result.productName} clickFunction = {this.populateEditForm}/>
    });
    
    return (
      <div>
      <div className = "editItemContainer">
        
          <h1> Select Item To Edit </h1>
          <h5> (If uploading new pictures, old pictures will be discarded/replaced) </h5>
          <div className = "textForm">
            {products}
            </div>
            
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
                    // rows={2}
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
                    style={style.field}
                  />
                </div>

                <div className = {this.state.itemStockCSS} id="row">
                  <TextField
                    label="Stock"
                    required="true"
                    type="number"
                    value = {this.state.stock}
                    onChange={(event) => this.setState({ stock: event.target.value })}
                    style={style.field}
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
                
                <div id ="column">
                <FileUploader accept="image/*" onChange = {this.handleFileChange}
                  storageRef =  {firebase.storage().ref('/images' + '/' + this.props.vendorID + '/' + this.state.pid)} ref = {instance => { this.fileUploader = instance; } }
                  multiple
                  onUploadError={(error) => {
                    this.props.notifier({
                      title: "Error",
                      message: error.toString(),
                      type: "danger"
                    });
                  }}                  
                  style={style.field}
                />
                </div>
               
              <div id ="column">
                <FileUploader accept="image/*" onChange = {this.handleFileChange}
                  storageRef =  {firebase.storage().ref('/images' + '/' + this.props.vendorID + '/' + this.state.pid)} ref = {instance => { this.fileUploader = instance; } }
                  multiple
                  onUploadError={(error) => {
                    this.props.notifier({
                      title: "Error",
                      message: error.toString(),
                      type: "danger"
                    });
                  }}                  
                  style={style.field}
                />
                </div>  

                <div id ="column">
                <FileUploader accept="image/*" onChange = {this.handleFileChange}
                  storageRef =  {firebase.storage().ref('/images' + '/' + this.props.vendorID + '/' + this.state.pid)} ref = {instance => { this.fileUploader = instance; } }
                  multiple
                  onUploadError={(error) => {
                    this.props.notifier({
                      title: "Error",
                      message: error.toString(),
                      type: "danger"
                    });
                  }}                  
                  style={style.field}
                />
                </div>

                <div id ="column">
                <FileUploader accept="image/*" onChange = {this.handleFileChange}
                  storageRef =  {firebase.storage().ref('/images' + '/' + this.props.vendorID + '/' + this.state.pid)} ref = {instance => { this.fileUploader = instance; } }
                  multiple
                  onUploadError={(error) => {
                    this.props.notifier({
                      title: "Error",
                      message: error.toString(),
                      type: "danger"
                    });
                  }}                  
                  style={style.field} 
                />
                </div>

                <Button 
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick = {this.updateItemInfo}> 
                  Update Item 
                </Button>   
                </div>    
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
