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
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';
import firebaseConfig from '../../config/ecs193-ecommerce-firebase-adminsdk-7iy3n-f581d24562.json';

const config = {
  apiKey: firebaseConfig.private_key,
  authDomain: "ecs193-ecommerce.firebaseapp.com",
  databaseURL: "https://ecs193-ecommerce.firebaseio.com",
  storageBucket: "ecs193-ecommerce.appspot.com"
};

const imageLocation = "images/vendors/";

firebase.initializeApp(config);


class AddProduct extends Component {
  constructor(props){
    super(props);
    this.state = {
      productName: '',
      productInfo: '',
      productPrice: '',
      stock: '',
      productID: '',
      isApparel: false,
      small: 0,
      medium: 0,
      large: 0,
      xsmall: 0,
      xlarge: 0,
      apparelCSS: "hideApparelSizes",
      images: []
    }
    this.addProduct = this.addProduct.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    // this.handleFileChange = this.handleFileChange.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  //upload success
  handleUploadSuccess = filename => {
    firebase
      .storage()
      .ref("images")
      .child(filename)
      // .getDownloadURL()
      // .then(url => this.setState({ avatarURL: url }));
  };

  //change number of files to upload
  handleFileChange = (event) => {
    const { target: { files } } = event;
    const filesToStore = [];
    console.log(files);
    console.log(files[0]);

    filesToStore.push(files[0]);

    //generate vid to match product with image
    let randomText = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 20; i++) {
      randomText += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    // files[0].forEach(file => {
    //   filesToStore.push(file);
    // });

    this.setState({
      images: filesToStore,
      productID: randomText
    });
  };

  //upload images to database
  uploadFiles(){
    const files = this.state.images;
    files.forEach(file => {
      this.fileUploader.startUpload(file);
    });
  }

  //add product that is an apparel type
  //add product to vendor's collection in database
  addProduct(){ 
    if(this.state.apparel === false){
      const apiURL = "/api/adminProducts/addNewProduct";
      axios.post(apiURL, {
        params:{
          vid: this.props.vid,
          user: this.props.user,
          productInfo: this.state.productInfo,
          productName: this.state.productName,
          productPrice: this.state.productPrice,
          pid: this.state.productID,
          stock: this.state.stock,
          apparel: this.state.apparel,
          s_stock: this.state.small,
          m_stock: this.state.medium,
          l_stock: this.state.large,
          xs_stock: this.state.xsmall,
          xl_stock: this.state.xlarge
        }
      })
      .then(res => {
        alert(res.data.message);
        this.uploadFiles();
      })
      .catch(err => {
        alert(err);
      })
    }

    //if the item is not an apparel
    else{
      const apiURL = "/api/adminProducts/addNewProduct";
      axios.post(apiURL, {
        params:{
          vid: this.props.vid,
          user: this.props.user,
          productInfo: this.state.productInfo,
          productName: this.state.productName,
          productPrice: this.state.productPrice,
          stock: this.state.stock,
          pid: this.state.productID
        }
      })
      .then(res => {
        alert(res.data.message);
        this.uploadFiles();
      })
      .catch(err => {
        alert(err);
      })
    }
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

            <FileUploader accept="image/*" onChange = {this.handleFileChange}
              storageRef =  {firebase.storage().ref(imageLocation + this.state.productID)} ref = {instance => { this.fileUploader = instance; } }
              multiple 
            />

            <FormControl component="fieldset">
              <FormLabel component="legend">Product Type </FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender2"
                value={this.state.value}
                onChange={this.handleChange}
              >
                <FormControlLabel
                  control={<Radio color="primary" />}
                  value = "item"
                  label="Item"
                  labelPlacement="start"
                  onChange={() => this.setState({ isApparel: false, apparelCSS: 'hideApparelSizes'})}
                />

                <FormControlLabel
                  control={<Radio color="primary" />}
                  value = "apparel"
                  label="Apparel"
                  labelPlacement="start"
                  onChange={() => this.setState({ isApparel: true, apparelCSS: 'showApparelSizes'})}
                />
              </RadioGroup>
            </FormControl>

            {/* add stock for apparel sizes */}
            <div className = {this.state.apparelCSS}>

              <div className = "textForm" id="row">
                <TextField
                  label="Small Stock"
                  required="false"
                  onChange={(event) => this.setState({ small: event.target.value })}
                />
              </div>

              <div className = "textForm" id="row">
                <TextField
                  label="Medium Stock"
                  required="false"
                  onChange={(event) => this.setState({ medium: event.target.value })}
                />
              </div>

              <div className = "textForm" id="row">
                <TextField
                  label="Large Stock"
                  required="false"
                  onChange={(event) => this.setState({ large: event.target.value })}
                />
              </div>
              <div className = "textForm" id="row">
                <TextField
                  label="X-Small Stock"
                  required="false"
                  onChange={(event) => this.setState({ xsmall: event.target.value })}
                />
              </div>

              <div className = "textForm" id="row">
                <TextField
                  label="X-Large Stock"
                  required="false"
                  onChange={(event) => this.setState({ xlarge: event.target.value })}
                />
              </div>
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
