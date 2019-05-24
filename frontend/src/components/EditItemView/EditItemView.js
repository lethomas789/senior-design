import React, { Component } from "react";
import "./EditItemView.css";
import EditItem from "../EditItem/EditItem";
import axios from "axios";
import { connect } from "react-redux";
// import actions from "../../store/actions";
// import Grid from '@material-ui/core/Grid';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import FileUploader from "react-firebase-file-uploader";
import firebase from "firebase";
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

const maxImageSize = 100000;

class EditItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      name: "",
      info: "",
      pickupLocation: "",
      stock: "",
      price: "",
      isApparel: false,
      vid: this.props.vendorID,
      pid: "",
      lastUpdate: "",
      lastUser: "",
      user: this.props.user,
      productPicture: [],
      pickupTime: "",
      small: 0,
      medium: 0,
      large: 0,
      xsmall: 0,
      xlarge: 0,
      apparelCSS: "hideApparelSizes",
      itemStockCSS: "showItemStock",
      images: [],
      imageNames: [],
      newImages: false,
      itemSelected: false
    };
  }

  //get all items from vendor, display to allow admin to edit item
  getVendorProducts = () => {
    const apiURL = "/api/getVendorProducts";

    //get all products of current vendor based on vendor id
    axios
      .get(apiURL, {
        params: {
          vid: this.props.vendorID
        }
      })
      .then(res => {
        if (res.data.success === true) {
          //update list of items
          this.setState({
            items: res.data.data
          });
        } else {
          this.props.notifier({
            title: "Error",
            message: "Error getting items",
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
  };

  //get items of vendor from database
  //allow admin to view and select which item to edit
  componentDidMount() {
    this.getVendorProducts();
  }

  //if vendor changes, get updated items
  //restart component as if just rendered to handle new vendor items
  //clears out previous item info from previous vendor
  componentDidUpdate(prevProps) {
    if (prevProps.vendorID != this.props.vendorID) {
      this.getVendorProducts();
      this.setState({
        items: [],
        name: "",
        info: "",
        stock: "",
        price: "",
        isApparel: false,
        vid: this.props.vendorID,
        pid: "",
        lastUpdate: "",
        lastUser: "",
        user: this.props.user,
        productPicture: [],
        small: 0,
        medium: 0,
        large: 0,
        xsmall: 0,
        xlarge: 0,
        apparelCSS: "hideApparelSizes",
        itemStockCSS: "showItemStock",
        images: [],
        imageNames: [],
        newImages: false,
        itemSelected: false
      });
    }
  }

  //populate edit forms based on which item was selected
  //name parameter finds matching product info in state array of items
  populateEditForm = name => {
    //go through each item in array and determine which item matches
    for (let i = 0; i < this.state.items.length; i++) {
      //if matching product, populate form data and state of component
      if (this.state.items[i].productName === name) {
        var currentItem = this.state.items[i];
        //if the item selected is not an apparel, do not display apparel sizes
        if (currentItem.isApparel === false) {
          this.setState({
            name: name,
            info: currentItem.productInfo,
            price: String(currentItem.productPrice),
            stock: currentItem.stock,
            pid: currentItem.pid,
            productPicture: currentItem.productPicture,
            isApparel: currentItem.isApparel,
            apparelCSS: "hideApparelSizes",
            itemStockCSS: "showItemStock",
            itemSelected: true
          });
        }

        //if the item is an apparel, display and update size stock
        else {
          this.setState({
            name: name,
            info: currentItem.productInfo,
            price: String(currentItem.productPrice),
            stock: currentItem.stock,
            pid: currentItem.pid,
            productPicture: currentItem.productPicture,
            isApparel: currentItem.isApparel,
            small: currentItem.s_stock,
            medium: currentItem.m_stock,
            large: currentItem.l_stock,
            xsmall: currentItem.xs_stock,
            xlarge: currentItem.xl_stock,
            apparelCSS: "showApparelSizes",
            itemStockCSS: "hideItemStock",
            itemSelected: true
          });
        }
      }
    }
  };

  //handle input change for product price
  handlePriceChange = price => {
    //if user types a non-number or doesn't press delete/backspace, don't register input change
    if (isNaN(price.target.value) === true && price.target.value != "") {
      return;
    }

    //else change value
    else {
      this.setState({
        price: price.target.value
      });
    }
  };

  //handle stock change for non apparel items
  //non apparel, account for empty field
  handleStockChange = stock => {
    //if the user backspaces or presses delete, create empty input for user to enter number
    //converting "" to number using Number(stock) converts "" to 0
    //if user tries to type a letter, just convert it to 0 or ""
    if (isNaN(stock.target.value) === true || stock.target.value == "") {
      this.setState({
        stock: ""
      });
      return;
    }

    //if user enters a negative stock value, set default to "" in background
    //display notifier
    else if (Number(stock.target.value) < 0) {
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
    else {
      this.setState({
        stock: Number(stock.target.value)
      });
    }
  };

  //handle stock change for apparel items, update total stock values when user changes input
  handleStockChangeApparel = name => stock => {
    //check if user is trying to type non-number or letter
    if (isNaN(stock.target.value) === true && stock.target.value != "") {
      return;
    }

    //if the user backspaces or presses delete, create empty input for user to enter number
    //checks if user types a number, if user types a non-number set default value to "", or 0
    else if (isNaN(stock.target.value) === true || stock.target.value == "") {
      this.setState(
        {
          [name]: ""
        },
        () => {
          //still add new running total if user removes value
          //add running total of stocks when value is changed, callback function after state was updated
          //when user adds "", records value as 0
          var runningStockTotal = 0;
          runningStockTotal =
            Number(this.state.small) +
            Number(this.state.medium) +
            Number(this.state.large) +
            Number(this.state.xsmall) +
            Number(this.state.xlarge);

          //update stock with running total
          this.setState({
            stock: Number(runningStockTotal)
          });
        }
      );
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
            stock: Number(runningStockTotal)
          });
        }
      );
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
  };

  //detects when an image is uploaded from user
  //change number of files to upload
  //same function from AddProduct
  handleFileChange = event => {
    //extract file from upload component
    const {
      target: { files }
    } = event;

    //TO DO modify file size
    //check if image being uploaded exceeds max file size
    if (files[0].size > maxImageSize) {
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
    //validators to check for proper input

    //user needs to select item first
    if (this.state.itemSelected === false) {
      this.props.notifier({
        title: "Error",
        message: "Please select an item to edit from the list",
        type: "danger"
      });
      return;
    }

    //product name
    if (this.state.name === "") {
      this.props.notifier({
        title: "Error",
        message: "Please insert product name",
        type: "danger"
      });
      return;
    }

    //product info
    if (this.state.info === "") {
      this.props.notifier({
        title: "Error",
        message: "Please insert product info",
        type: "danger"
      });
      return;
    }

    //product price
    if (this.state.price === "") {
      this.props.notifier({
        title: "Error",
        message: "Please insert product price",
        type: "danger"
      });
      return;
    }

    //check to see if user inserted correct price format $D.CC
    //if user enters money in format $D, then okay proceed
    if (this.state.price.includes(".") === true) {
      //check to see if user inputted more than 2 spots for cents
      var checkCentValues = this.state.price.split(".");
      //split into array of items before . and after .
      if (checkCentValues[1].length != 2) {
        this.props.notifier({
          title: "Error",
          message: "Please insert correct price format",
          type: "danger"
        });
        return;
      }
    }

    //check product stock greater than 0
    if (Number(this.state.stock) === 0) {
      this.props.notifier({
        title: "Error",
        message: "Please insert stock greater than 0",
        type: "danger"
      });
      return;
    }

    //proceed with edit item process
    const apiURL = "/api/adminProducts/editProduct";
    var imagesToUpload;
    var newImages = false;

    //if the admin did not upload anymore pictures, use old array
    if (this.state.imageNames.length === 0) {
      imagesToUpload = this.state.productPicture;
      // console.log("uploading old pictures");
    }

    //if admin updated new pictures, send new array
    else {
      // console.log("updating new pictures");
      imagesToUpload = this.state.imageNames;
      newImages = true;
    }

    //params for editing item
    axios
      .patch(apiURL, {
        withCredentials: true,
        params: {
          vid: this.state.vid,
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
        if (res.data.success === true && this.state.imageNames.length != 0) {
          this.uploadFiles();
          this.props.notifier({
            title: "Success",
            message: res.data.message.toString(),
            type: "success"
          });
        } else if (res.data.success === true) {
          this.props.notifier({
            title: "Success",
            message: res.data.message.toString(),
            type: "success"
          });
        } else {
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
  }; // end of updating item

  render() {
    //render items to select for editing
    const products = this.state.items.map(result => {
      return (
        <EditItem
          name={result.productName}
          clickFunction={this.populateEditForm}
        />
      );
    });

    return (
      <div>
        <div className="editItemContainer">
          <h1> Select Item To Edit </h1>
          <h5>
            (If uploading new pictures, old pictures will be discarded/replaced)
          </h5>
          <div className="textForm">{products}</div>

          <div className="tooltip">
            <span className="tooltiptext">In progress </span>
            <div className="textForm" id="row">
              <TextField
                label="Product Name"
                required={true}
                value={this.state.name}
                onChange={event => this.setState({ name: event.target.value })}
                style={style.field}
              />
            </div>
          </div>

          <div className="tooltip">
            <span className="tooltiptext">In progress </span>
            <div className="textFormEdit" id="row">
              <TextField
                label="Product Info"
                required={true}
                multiline={true}
                // rows={2}
                value={this.state.info}
                onChange={event => this.setState({ info: event.target.value })}
                style={style.field}
              />
            </div>
          </div>

          <div className="tooltip">
            <span className="tooltiptext">In progress </span>
            <div className="textFormEdit" id="row">
              <TextField
                label="Product Price"
                required={true}
                value={this.state.price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"> $ </InputAdornment>
                  )
                }}
                onChange={event => this.handlePriceChange(event)}
                style={style.field}
              />
            </div>
          </div>

          <div className="tooltip">
            <span className="tooltiptext">In progress </span>
            <div className={this.state.itemStockCSS} id="row">
              <TextField
                label="Stock"
                required={true}
                value={this.state.stock}
                onChange={event => this.handleStockChange(event)}
                style={style.field}
              />
            </div>
          </div>

          {/* add quantity for apparel sizes, toggel visibility if selected */}
          <div className={this.state.apparelCSS}>
            <div className="textForm" id="row">
              <TextField
                label="Product Stock"
                value={this.state.stock}
                disabled
              />
            </div>

            <div className="textForm" id="row">
              <TextField
                label="Small Stock"
                required="false"
                value={this.state.small}
                onChange={this.handleStockChangeApparel("small")}
              />
            </div>

            <div className="textForm" id="row">
              <TextField
                label="Medium Stock"
                required="false"
                value={this.state.medium}
                onChange={this.handleStockChangeApparel("medium")}
              />
            </div>

            <div className="textForm" id="row">
              <TextField
                label="Large Stock"
                required="false"
                value={this.state.large}
                onChange={this.handleStockChangeApparel("large")}
              />
            </div>

            <div className="textForm" id="row">
              <TextField
                label="X-Small Stock"
                required="false"
                value={this.state.xsmall}
                onChange={this.handleStockChangeApparel("xsmall")}
              />
            </div>

            <div className="textForm" id="row">
              <TextField
                label="X-Large Stock"
                required="false"
                value={this.state.xlarge}
                onChange={this.handleStockChangeApparel("xlarge")}
              />
            </div>
          </div>
          <div className="tooltip">
            <span className="tooltiptext">
              Note: Any new pictures for an item that are uploaded will
              overwrite all current pictures for the item. You will have to
              upload any old pictures again.
            </span>
            <div id="descriptor">
              <p>To edit any of the pictures for an item please click below.</p>
            </div>
          </div>
          <div id="column" className="tester">
            <FileUploader
              accept="image/*"
              onChange={this.handleFileChange}
              storageRef={firebase
                .storage()
                .ref(
                  "/images" + "/" + this.props.vendorID + "/" + this.state.pid
                )}
              ref={instance => {
                this.fileUploader = instance;
              }}
              multiple
              onUploadError={error => {
                this.props.notifier({
                  title: "Error",
                  message: error.toString(),
                  type: "danger"
                });
              }}
              style={style.field}
            />
          </div>

          <div id="column" className="tester">
            <FileUploader
              accept="image/*"
              onChange={this.handleFileChange}
              storageRef={firebase
                .storage()
                .ref(
                  "/images" + "/" + this.props.vendorID + "/" + this.state.pid
                )}
              ref={instance => {
                this.fileUploader = instance;
              }}
              multiple
              onUploadError={error => {
                this.props.notifier({
                  title: "Error",
                  message: error.toString(),
                  type: "danger"
                });
              }}
              style={style.field}
            />
          </div>

          <div id="column" className="tester">
            <FileUploader
              accept="image/*"
              onChange={this.handleFileChange}
              storageRef={firebase
                .storage()
                .ref(
                  "/images" + "/" + this.props.vendorID + "/" + this.state.pid
                )}
              ref={instance => {
                this.fileUploader = instance;
              }}
              multiple
              onUploadError={error => {
                this.props.notifier({
                  title: "Error",
                  message: error.toString(),
                  type: "danger"
                });
              }}
              style={style.field}
            />
          </div>

          <div id="column" className="tester">
            <FileUploader
              accept="image/*"
              onChange={this.handleFileChange}
              storageRef={firebase
                .storage()
                .ref(
                  "/images" + "/" + this.props.vendorID + "/" + this.state.pid
                )}
              ref={instance => {
                this.fileUploader = instance;
              }}
              multiple
              onUploadError={error => {
                this.props.notifier({
                  title: "Error",
                  message: error.toString(),
                  type: "danger"
                });
              }}
              style={style.field}
            />
          </div>
          <div className="tooltip">
            <span className="tooltiptext">In progress </span>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={this.updateItemInfo}
              style={{
                backgroundColor: "#DAAA00",
                color: "white",
                fontFamily: "Proxima Nova",
                boxShadow: "none"
              }}
            >
              Update Item
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

//redux, pass as vid and username from redux store to use in component
const mapStateToProps = state => {
  return {
    vendorID: state.auth.vendorID
  };
};

export default connect(
  mapStateToProps,
  null
)(EditItemView);
