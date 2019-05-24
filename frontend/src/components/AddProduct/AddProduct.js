import React, { Component } from "react";
import "./AddProduct.css";
import { connect } from "react-redux";
import axios from "axios";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
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

const maxImageSize = 100000;

//component to allow admin to add products for purchase
class AddProduct extends Component {
  constructor(props) {
    super(props);
    //EDIT, converting "" to Number results in 0, so default values set to "" to allow user to remove/delete input
    this.state = {
      productName: "",
      productInfo: "",
      productPrice: "",
      stock: "",
      productID: "",
      isApparel: false,
      isItem:false,
      apparelStock: 0,
      small: "",
      medium: "",
      large: "",
      xsmall: "",
      xlarge: "",
      apparelCSS: "hideApparelSizes",
      itemShowStock: "showItemStock",
      images: [],
      imageNames: []
    };
    this.addProduct = this.addProduct.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  //upload success
  handleUploadSuccess = filename => {
    firebase
      .storage()
      .ref("images")
      .child(filename);
  };

  //handle input change for product price
  handlePriceChange = price => {
    //if user types a non-number or doesn't press delete/backspace, don't register input change
    if(isNaN(price.target.value) === true && price.target.value != ""){
      return;
    }

    //else change value
    else{
      this.setState({
        productPrice: price.target.value
      })
    }
  }


  //non apparel, account for empty field
  handleStockChange = stock => {
    //if the user backspaces or presses delete, create empty input for user to enter number
    //converting "" to number using Number(stock) converts "" to 0
    //if user tries to type a letter, just convert it to 0 or "" 
    if(isNaN(stock.target.value) === true || stock.target.value == "" ){
      this.setState({
        stock: ""
      })
      return;
    }

    //if user enters a negative stock value, set default to "" in background
    //display notifier
    else if(Number(stock.target.value) < 0){
      this.setState({
        stock: ""
      });

      this.props.notifier({
        title: "Warning",
        message: "Please enter stock value greater than or equal to 0",
        type: "warning"
      });
    }

    //else, set stock to user's input of number
    else{
      this.setState({
        stock: Number(stock.target.value)
      })
    }
  }

  //handle stock change, update total stock values when user changes input
  handleStockChangeApparel = name => stock => {

    //check if user is trying to type non-number or letter, if so don't register change
    if(isNaN(stock.target.value) === true && stock.target.value != ""){
      return;
    }

    //if the user backspaces or presses delete, create empty input for user to enter number
    //checks if user types a number, if user types a non-number set default value to "", or 0
    else if(isNaN(stock.target.value) === true || stock.target.value == "" ){
      this.setState({
        [name]: ""
      }, 
      () => {
        //still add new running total if user removes value
        //add running total of stocks when value is changed, callback function after state was updated
        //when user adds "", records value as 0 and update new running total
        var runningStockTotal = 0;
        runningStockTotal =
          Number(this.state.small) +
          Number(this.state.medium) +
          Number(this.state.large) +
          Number(this.state.xsmall) +
          Number(this.state.xlarge);

        //update stock with running total
        this.setState({
          apparelStock: Number(runningStockTotal)
        });
      })
    }

    //if the user is setting the stock to a negative value, set default to 0
    else if (Number(stock.target.value) < 0) {
      this.setState({
        [name]: ""
      });
      this.props.notifier({
        title: "Warning",
        message: "Please enter stock value greater than or equal to 0",
        type: "warning"
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

          runningStockTotal =
            Number(this.state.small) +
            Number(this.state.medium) +
            Number(this.state.large) +
            Number(this.state.xsmall) +
            Number(this.state.xlarge);

          //update stock with running total
          this.setState({
            apparelStock: Number(runningStockTotal)
          });
        }
      );
    }
  };

  //detects when an image is uploaded from user
  //change number of files to upload
  handleFileChange = event => {
    //extract file from upload component
    const {
      target: { files }
    } = event;

    //TO DO modify file size
    //check if image being uploaded exceeds max file size
    if(files[0].size > maxImageSize){
      this.props.notifier({
        title: "Error",
        message: "Please upload image less than 1MB",
        type: "danger"
      });

      //if file exceeds file size, cancel upload and set file input to null
      //this is as if no file was uploaded
      event.target.value = null;
      return;
    }

    //if file size is acceptable, proceed saving file in array of images to upload to server

    //store image names
    // const filesToStore = [];
    const filesToStore = this.state.imageNames;

    //store actual image files
    const actualImages = this.state.images;
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
    //validators for input fields, making sure user has typed something

    //product name
    if(this.state.productName === ""){
      this.props.notifier({
        title: "Error",
        message: "Please insert name for product",
        type: "danger"
      });
      return;
    }

    //product info
    if(this.state.productInfo === ""){
      this.props.notifier({
        title: "Error",
        message: "Please insert info for product",
        type: "danger"
      });
      return;
    }

    //product price
    if(this.state.productPrice === ""){
      this.props.notifier({
        title: "Error",
        message: "Please insert price for product",
        type: "danger"
      });
      return;
    }

    //check to see if user inserted correct price format $D.CC
    //if user enters money in format $D, then okay proceed
    //throw an error if invalid money format such as $D.CCCCC or $D. or $D.C
    if(this.state.productPrice.includes(".") === true){
      //check to see if user inputted more than 2 spots for cents
      var checkCentValues = this.state.productPrice.split(".");
      //split into array of items before . and after .
      if(checkCentValues[1].length != 2){
        this.props.notifier({
          title: "Error",
          message: "Please insert correct price format",
          type: "danger"
        });
        return;
      }
    }

    //user needs to select item or apparel
    if(this.state.isApparel === false && this.state.isItem === false){
      this.props.notifier({
        title: "Error",
        message: "Please select an item type",
        type: "danger"
      });
      return;
    }

    //handle if item being added is an apparel
    if (this.state.isApparel === true) {
      //check if apparel stock is greater than 0
      if(Number(this.state.apparelStock) === 0){
        this.props.notifier({
          title: "Error",
          message: "Please insert stock for apparel items",
          type: "danger"
        });
        return;
      }

      //check for at least one image was uploaded for product
      if(this.state.images.length === 0 && this.state.imageNames.length === 0){
        this.props.notifier({
          title: "Error",
          message: "Please upload at least one image for product",
          type: "danger"
        });
        return;
      }

      //proceed with adding product
      const apiURL = "/api/adminProducts/addNewProduct";

      //EDIT stock value is apparelStock, total apparel stock value summed from different sizes of apparel
      //differs from stock by itself, which is total stock of non-apparel item
      axios
        .post(apiURL, {
          withCredentials: true,
          params: {
            vid: this.props.vid,
            productInfo: this.state.productInfo,
            productName: this.state.productName,
            productPrice: this.state.productPrice,
            pid: this.state.productID,
            stock: this.state.apparelStock,
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
    else if (this.state.isItem === true) {
      //check if stock is greater than 0
      if(Number(this.state.stock) === 0){
        this.props.notifier({
          title: "Error",
          message: "Please insert stock greater than 0 for item product",
          type: "danger"
        });
        return;
      }
      
      //check that at least one image was uploaded
      if(this.state.images.length === 0 && this.state.imageNames.length === 0){
        this.props.notifier({
          title: "Error",
          message: "Please upload at least one image for product",
          type: "danger"
        });
        return;
      }

      //proceed with adding product
      const apiURL = "/api/adminProducts/addNewProduct";
      axios
        .post(apiURL, {
          withCredentials: true,
          params: {
            vid: this.props.vid,
            productInfo: this.state.productInfo,
            productName: this.state.productName,
            productPrice: this.state.productPrice,
            stock: this.state.stock,
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

  //EDIT removed type=number field in text fields, typing "e" is considered number value, want to prevent letters in number input
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
                label="Product Price ($X.XX)"
                required= {true}
                //MaterialUI property to insert start text

                //bold dollar sign
                // InputProps={{
                //   startAdornment: <InputAdornment position="start"> <strong> $ </strong> </InputAdornment>,
                // }}

                //regular dollar sign,
                InputProps={{
                  startAdornment: <InputAdornment position="start"> $ </InputAdornment>,
                }}
                value = {this.state.productPrice}
                onChange = { (event) => this.handlePriceChange(event) }
                style={style.field}
              />
            </div>

            {/* toggle visibility of product stock
            if user is adding regular item, allow user to enter input
            calculate running total if item is an apparel */}
            
            <div className = "add-textForm" className = {this.state.itemShowStock} id = "row">
              <TextField
                label="Product Stock"
                required= {true}
                //remove type is number to allow user to enter backspace/delete character
                //check for number by using isNaN on input change
                value = {this.state.stock}
                onChange={
                  (event) => this.handleStockChange(event)
                }
                style={style.field}
              />
            </div>

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
                      isItem: true, 
                      apparelCSS: 'hideApparelSizes', 
                      itemShowStock: 'showItemStock', 
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
                  onChange={() => this.setState({ isApparel: true, isItem: false, apparelCSS: 'showApparelSizes', itemShowStock: 'hideItemStock', stock: ""})}
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
                  //EDIT show value of apparel stock, which differs from regular stock total
                  value = {this.state.apparelStock}
                  disabled
                />
              </div>
              
              <div className = "add-textForm" id="row">
                <TextField
                  label="Small Stock"
                  required="false"
                  //remove type is number to allow user to enter backspace/delete character
                  //check for number by using isNaN on input change
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
                  //remove type is number to allow user to enter backspace/delete character
                  //check for number by using isNaN on input change
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
                  //remove type is number to allow user to enter backspace/delete character
                  //check for number by using isNaN on input change
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
                  //remove type is number to allow user to enter backspace/delete character
                  //check for number by using isNaN on input change
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
                  //remove type is number to allow user to enter backspace/delete character
                  //check for number by using isNaN on input change
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
