import React, { Component } from "react";
import "./AddProduct.css";
import { connect } from "react-redux";
// import actions from "../../store/actions";
import axios from "axios";
// import Grid from "@material-ui/core/Grid";
// import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
// import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
// import InputLabel from "@material-ui/core/InputLabel";
// import MenuItem from "@material-ui/core/MenuItem";
import FormLabel from "@material-ui/core/FormLabel";
import InputAdornment from '@material-ui/core/InputAdornment';
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";
import firebaseConfig from "../../config/ecs193-ecommerce-firebase-adminsdk-7iy3n-f581d24562.json";

//config file for firebase
const config = {
  apiKey: firebaseConfig.private_key,
  authDomain: "ecs193-ecommerce.firebaseapp.com",
  databaseURL: "https://ecs193-ecommerce.firebaseio.com",
  storageBucket: "ecs193-ecommerce.appspot.com"
};

firebase.initializeApp(config);

//image location for firestore upload
const imageLocation = "images/vendors";

const style = {
  field: { width: "500px" }
};

//component to allow admin to add products for purchase
class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: "",
      productInfo: "",
      productPrice: "",
      stock: "",
      productID: "",
      isApparel: false,
      apparelStock: 0,
      small: "",
      medium: "",
      large: "",
      xsmall: "",
      xlarge: "",
      apparelCSS: "hideApparelSizes",
      itemShowStock: "showItemStock",
      images: [],
      imageNames: [],
      disableNonStockInput: false
    };
    this.addProduct = this.addProduct.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    // this.nonApparelStock = React.createRef();
  }

  //upload success
  handleUploadSuccess = filename => {
    firebase
      .storage()
      .ref("images")
      .child(filename);
  };


  //non apparel, account for empty field
  handleStockChange = stock => {
    //if user enters a negative stock value, set default to 0 in background
    //display notifier
    if(Number(stock.target.value) < 0){
      this.setState({
        stock: 0
      });
      this.props.notifier({
        title: "Warning",
        message: "Please enter stock value greater than or equal to 0",
        type: "warning"
      });
    }

    //if user doesn't type anything, set default to 0 in background
    else if(stock.target.value == ""){
      this.setState({
        stock:0
      });
    }

    //else, set stock to user's input
    else{
      this.setState({
        stock: Number(stock.target.value)
      })
    }
  }

  //handle stock change, update total stock values when user changes input
  handleStockChangeApparel = name => stock => {
    //if the user is setting the stock to a negative value, set default to 0
    if (Number(stock.target.value) < 0) {
      this.setState({
        [name]: 0
      });
      this.props.notifier({
        title: "Warning",
        message: "Please enter stock value greater than or equal to 0",
        type: "warning"
      });
    }

    //if the user presses delete or backspace, handle empty field
    else if (stock.target.value === "") {
      // this.setState({
      //   [name]: ""
      // });

      //set value to 0 in background
      this.setState({
        [name]: 0
      });
    }

    //update stock of current item and update running total of stock items
    else {
      //update stock value for current size
      //after updating current stock, update running total of stock for all sizes
      //callback function called after setState
      this.setState(
        {
          [name]: Number(stock.target.value)
        },
        () => {
          //add running total of stocks when value is changed, callback function after state was updated
          var runningStockTotal = 0;
          var smallValue = 0;
          var mediumValue = 0;
          var largeValue = 0;
          var xsmallValue = 0;
          var xlargeValue = 0;

          //set default value to 0, if not empty space, assign number value
          if(this.state.small != ""){
            smallValue = this.state.small;
          }

          else if(this.state.medium != ""){
            mediumValue = this.state.medium;
          }

          else if(this.state.large != ""){
            largeValue = this.state.large;
          }

          else if(this.state.xsmall != ""){
            xsmallValue = this.state.xsmall;
          }

          else if(this.state.xlarge != ""){
            xlargeValue = this.state.xlarge;
          }

          // runningStockTotal =
          //   Number(this.state.small) +
          //   Number(this.state.medium) +
          //   Number(this.state.large) +
          //   Number(this.state.xsmall) +
          //   Number(this.state.xlarge);

          runningStockTotal =
            Number(smallValue) +
            Number(mediumValue) +
            Number(largeValue) +
            Number(xsmallValue) +
            Number(xlargeValue);

          //update stock with running total
          this.setState({
            apparelStock: Number(runningStockTotal)
          });
        }
      );
    }
  };

  // setNonApparelStock = () => {
  //   this.nonApparelStock.current.props.value = "";
  //   console.log(this.nonApparelStock);
  // }

  //detects when an image is uploaded from user
  //change number of files to upload
  handleFileChange = event => {
    //extract file from upload component
    const {
      target: { files }
    } = event;

    //store image names
    // const filesToStore = [];
    const filesToStore = this.state.imageNames;

    //store actual image files
    const actualImages = this.state.images;
    // console.log(files);
    // console.log(files[0]);

    //store image name as an object
    let imageName = {};
    imageName.name = files[0].name;

    //push values to arrays
    filesToStore.push(imageName);
    actualImages.push(files[0]);

    //generate vid to match product with image
    let randomText = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 20; i++) {
      randomText += possible.charAt(
        Math.floor(Math.random() * possible.length)
      );
    }

    //set state of component
    this.setState({
      images: actualImages,
      productID: randomText,
      imageNames: filesToStore
    });
  };

  //upload images to database
  uploadFiles() {
    //for each file in images array, upload to database
    const files = this.state.images;
    files.forEach(file => {
      this.fileUploader.startUpload(file);
    });
  }

  //add product that is an apparel type
  //add product to vendor's collection in database
  addProduct() {
    //handle if item being added is an apparel
    if (this.state.isApparel === true) {
      const apiURL = "/api/adminProducts/addNewProduct";
      var apparelStockValue;
      if(this.state.apparelStock == ""){
        apparelStockValue = 0;
      }
      else{
        apparelStockValue = this.state.apparelStock;
      }
      axios
        .post(apiURL, {
          withCredentials: true,
          params: {
            vid: this.props.vid,
            productInfo: this.state.productInfo,
            productName: this.state.productName,
            productPrice: this.state.productPrice,
            pid: this.state.productID,
            // stock: this.state.stock,
            stock: apparelStockValue,
            isApparel: this.state.isApparel,
            s_stock: this.state.small,
            m_stock: this.state.medium,
            l_stock: this.state.large,
            xs_stock: this.state.xsmall,
            xl_stock: this.state.xlarge,
            productPicture: this.state.imageNames
          }
        })
        .then(res => {
          //upload image only on success
          if (res.data.success === true) {
            this.uploadFiles();
            this.props.notifier({
              title: "Success",
              message: res.data.message.toString(),
              type: "success"
            });
          }

          //add product failed
          else{
            this.props.notifier({
              title: "Error",
              message: res.data.message.toString(),
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
        });
    }

    //if the item is not an apparel
    else {
      const apiURL = "/api/adminProducts/addNewProduct";
      var stockValue;
      if(this.state.stock == ""){
        stockValue = 0;
      }
      else{
        stockValue = this.state.stock
      }
      axios
        .post(apiURL, {
          withCredentials: true,
          params: {
            vid: this.props.vid,
            productInfo: this.state.productInfo,
            productName: this.state.productName,
            productPrice: this.state.productPrice,
            stock: stockValue,
            pid: this.state.productID,
            isApparel: this.state.isApparel,
            productPicture: this.state.imageNames
          }
        })
        .then(res => {
          //upload image only on success
          if (res.data.success === true) {
            this.uploadFiles();
            this.props.notifier({
              title: "Success",
              message: res.data.message.toString(),
              type: "success"
            });
          }
          
          //product failed to upload
          else{
            this.props.notifier({
              title: "Error",
              message: res.data.message.toString(),
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
        });
    }
  }

  render() {
    return (
      <div className = "addProductContainer">
      {/* <Paper className="addProductPaperContainer"> */}
            <h1> Add Product </h1>
            <div className = "add-textForm" id="row">
              <TextField
                label="Product Name"
                required="true"
                onChange={(event) => this.setState({ productName: event.target.value })}
                style={style.field}
              />
            </div>

            <div className = "add-textForm" id="row">
              <TextField
                label="Product Info"
                required="true"
                multiline={true}
                rows={2}
                onChange={(event) => this.setState({ productInfo: event.target.value })}
                style={style.field}
              />
            </div>

            <div className = "add-textForm" id="row">
              <TextField
                label="Product Price"
                required= {true}
                type="number"
                //MaterialUI property to insert start text

                //bold dollar sign
                // InputProps={{
                //   startAdornment: <InputAdornment position="start"> <strong> $ </strong> </InputAdornment>,
                // }}

                //regular dollar sign,
                InputProps={{
                  startAdornment: <InputAdornment position="start"> $ </InputAdornment>,
                }}
                
                onChange={(event) => this.setState({ productPrice: event.target.value })}
                style={style.field}
              />
            </div>

            {/* toggle visibility of product stock
            if user is adding regular item, allow user to enter input
            calculate running total if item is an apparel */}
            
            {/* <div className = {this.state.itemShowStock} id = "row"> */}
            <div className = "add-textForm" id = "row">
              <TextField
                label="Product Stock"
                required= {true}
                type="number"
                value = {this.state.stock}
                //disable input for stock for non-apparel if user is inputting stock for apparel
                disabled = {this.state.disableNonStockInput}
                onChange={
                  (event) => this.handleStockChange(event)
                }
                style={style.field}
              />
              </div>
            {/* </div> */}

            <FormControl component="fieldset">
            <div className = "add-textForm">
              <FormLabel component="legend" style={style.field}>Select Product Type </FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender2"
                value={this.state.value}
                onChange={this.handleChange}
              >
            
                {/* if user selects item, hide apparel selections, toggle css */}
                <FormControlLabel
                  control={<Radio color="primary" />}
                  value = "item"
                  label="Item"
                  // labelPlacement="start"
                  onChange={() => 
                    this.setState({ 
                      isApparel: false, 
                      apparelCSS: 'hideApparelSizes', 
                      itemShowStock: 'showItemStock', 
                      disableNonStockInput: false,
                      apparelStock:0,
                      small: "",
                      medium: "",
                      large: "",
                      xsmall: "",
                      xlarge: ""
                  })}
                  style={style.field}
                />

                {/* if user selects apparel, display apparel options, hide product stock for item, display apparel version instead */}
                <FormControlLabel
                  control={<Radio color="primary" />}
                  value = "apparel"
                  label="Apparel"
                  // labelPlacement="start"
                  onChange={() => this.setState({ isApparel: true, apparelCSS: 'showApparelSizes', itemShowStock: 'hideItemStock', stock: "", disableNonStockInput: true})}
                />
              </RadioGroup>
              </div>
            </FormControl>

            {/* add quantity for apparel sizes, toggle visibility if selected */}
            <div className = {this.state.apparelCSS}>
              <div className = "add-textForm" id="row">
                <TextField
                  label="Apparel Product Stock"
                  type="number"
                  // value = {this.state.stock}
                  value = {this.state.apparelStock}
                  disabled
                />
              </div>
              
              <div className = "add-textForm" id="row">
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

              <div className = "add-textForm" id="row">
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

              <div className = "add-textForm" id="row">
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

              <div className = "add-textForm" id="row">
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

              <div className = "add-textForm" id="row">
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

            <div className = "add-textForm" id = "row">
              <div class = "tooltip"> <span class="tooltiptext">First image uploaded on the left is default image displayed on shop. Remaining images used in detail view </span><h5 className = "uploadImageText"> Upload Images </h5> </div>
              <div id = "column">
              <FileUploader accept="image/*" onChange = {this.handleFileChange}
                storageRef =  {firebase.storage().ref('/images' + '/' + this.props.vid + '/' + this.state.productID)} ref = {instance => { this.fileUploader = instance; } }
                multiple
                onUploadError={(error) => {
                  this.props.notifier({
                    title: "Error",
                    message: error.toString(),
                    type: "danger"
                  });
                }} 
              />
              </div>

              <div id = "column">
              <FileUploader accept="image/*" onChange = {this.handleFileChange}
                storageRef =  {firebase.storage().ref('/images' + '/' + this.props.vid + '/' + this.state.productID)} ref = {instance => { this.fileUploader = instance; } }
                multiple
                onUploadError={(error) => {
                  this.props.notifier({
                    title: "Error",
                    message: error.toString(),
                    type: "danger"
                  });
                }}              
              />
              </div>

              <div id = "column">
              <FileUploader accept="image/*" onChange = {this.handleFileChange}
                storageRef =  {firebase.storage().ref('/images' + '/' + this.props.vid + '/' + this.state.productID)} ref = {instance => { this.fileUploader = instance; } }
                multiple
                onUploadError={(error) => {
                  this.props.notifier({
                    title: "Error",
                    message: error.toString(),
                    type: "danger"
                  });
                }}              
              />
              </div>
          
              <FileUploader accept="image/*" onChange = {this.handleFileChange}
                storageRef =  {firebase.storage().ref('/images' + '/' + this.props.vid + '/' + this.state.productID)} ref = {instance => { this.fileUploader = instance; } }
                multiple
                onUploadError={(error) => {
                  this.props.notifier({
                    title: "Error",
                    message: error.toString(),
                    type: "danger"
                  });
                }}              
              />
            </div>

            <Button variant = "contained" 
            onClick = {this.addProduct}
            style = {{backgroundColor:"#DAAA00",
                  color: "white", 
                  fontFamily: "Proxima Nova", 
                  boxShadow: "none"}}> 
                  Add Product  
                  </Button>
            {/* </Paper> */}
      </div>
    );
  }
}

//redux

//obtain state from store as props for component
//get cart items, login value, and user email
const mapStateToProps = state => {
  return {
    items: state.cart.items,
    login: state.auth.login,
    vid: state.auth.vendorID
  };
};

export default connect(
  mapStateToProps,
  null
)(AddProduct);
