import React, { Component } from "react";
import PropTypes from "prop-types";
import actions from "../../store/actions";
import { connect } from "react-redux";
import axios from "axios";
import Button from "@material-ui/core/Button";
import "./ShopItemDetailed.css";
import ReactImageMagnify from "react-image-magnify";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

class ItemImageViewer extends Component {
  state = {
    currentImage: 0
  };

  // view next image, increment index in image array
  nextImage = () => {
    if (this.state.currentImage < this.props.imageLink.length - 1) {
      this.setState({
        currentImage: this.state.currentImage + 1
      });
    }
  };

  // previous image, decrement index in image array
  prevImage = () => {
    if (this.state.currentImage > 0) {
      this.setState({
        currentImage: this.state.currentImage - 1
      });
    }
  };

  render() {
    return (
      <section className="item-image">
        <div className="magnify-container">
          <ReactImageMagnify
            {...{
              smallImage: {
                alt: "Test Image",
                isFluidWidth: true,
                src: this.props.imageLink[this.state.currentImage]
              },
              largeImage: {
                src: this.props.imageLink[this.state.currentImage],
                width: 1200,
                height: 1800,
                enlargedImagePosition: "over"
              }
            }}
          />

          <div className="imageButtons">
            <button onClick={this.prevImage} id="prevImage">
              {" "}
              Previous{" "}
            </button>
            <button onClick={this.nextImage} id="nextImage">
              {" "}
              Next{" "}
            </button>
          </div>
        </div>
      </section>
    );
  }
}

class ApparelItemInfo extends Component {
  render() {
    const {
      productName,
      productPrice,
      productInfo,
      amtPurchased,
      handleQuantityChange,
      addItem,
      handleChange,
      size,
      displayApparelStock,
    } = this.props;

    return (
      <section className="item-info">
        <h2> {productName} </h2>
        <div className="price">${Number(productPrice).toFixed(2)}</div>
        <div>
          <b>Availability</b>: {displayApparelStock()}
          <p>
            <b>Club</b>: TODO
          </p>
        </div>
        <p className="description">{productInfo}</p>

        <div className="select-container">
          {/* TODO fix selector */}
          <FormControl className="select-size">
            <InputLabel htmlFor="select-size">Select Size</InputLabel>
            <Select
              value={size}
              onChange={handleChange("size")}
              inputProps={{
                name: "size",
                id: "select-size"
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"X-Small"}> X-Small </MenuItem>
              <MenuItem value={"Small"}> Small </MenuItem>
              <MenuItem value={"Medium"}> Medium </MenuItem>
              <MenuItem value={"Large"}> Large </MenuItem>
              <MenuItem value={"X-Large"}> X-Large </MenuItem>
            </Select>
          </FormControl>

          <TextField
            className="quantity"
            label="Quantity"
            value={amtPurchased}
            onChange={handleQuantityChange}
            type="number"
            InputLabelProps={{
              shrink: true
            }}
          />
        </div>

        <div className="btn-cart">
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={addItem}
          >
            Add To Cart
          </Button>
        </div>
      </section>
    );
  }
}

ApparelItemInfo.propTypes = {
  productName: PropTypes.string.isRequired,
  productPrice: PropTypes.number.isRequired,
  productInfo: PropTypes.string.isRequired,
  amtPurchased: PropTypes.number.isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  displayApparelStock: PropTypes.func.isRequired,
  size: PropTypes.string.isRequired,
}

class ItemInfo extends Component {
  render() {
    const {
      productName,
      productPrice,
      productInfo,
      amtPurchased,
      handleQuantityChange,
      addItem,
      displayStock
    } = this.props;

    return (
      <section className="item-info">
        <h2> {productName} </h2>
        <div className="price">${Number(productPrice).toFixed(2)}</div>
        <div>
          <b>Availability</b>: {displayStock()}
          <p>
            <b>Club</b>: TODO
          </p>
        </div>
        <p className="description">{productInfo}</p>

        <div className="select-container">
          <TextField
            className="quantity"
            label="Quantity"
            value={amtPurchased}
            onChange={handleQuantityChange}
            type="number"
            InputLabelProps={{
              shrink: true
            }}
          />
        </div>

        <div className="btn-cart">
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={addItem}
          >
            Add To Cart
          </Button>
        </div>
      </section>

    );
  }
}

ItemInfo.propTypes = {
  productName: PropTypes.string.isRequired,
  productPrice: PropTypes.number.isRequired,
  productInfo: PropTypes.string.isRequired,
  amtPurchased: PropTypes.number.isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
  addItem: PropTypes.func.isRequired,
  displayStock: PropTypes.func.isRequired,
}


class ShopItemDetailed extends Component {
  state = {
    imageLink: "",
    productInfo: "",
    productName: "",
    productPrice: "",
    amtPurchased: 1,
    vid: "",
    productStock: "",
    isApparel: false,
    s_stock: 0,
    m_stock: 0,
    l_stock: 0,
    xs_stock: 0,
    xl_stock: 0,
    size: "",
    currentImage: 0
  };

  // TODO make this smarter
  displayApparelStock = () => {
    const { xs_stock, s_stock, m_stock, l_stock, xl_stock } = this.state;
    const totalStock = xs_stock + s_stock + m_stock + l_stock + xl_stock;

    let text = "";

    // available stock
    if (totalStock > 10) {
      text = "In Stock";
    }
    // less than 10, greater than 0, display alert
    else if (totalStock > 0) {
      text = `Only ${totalStock} items left!`;
    } else if (totalStock === 0) {
      text = "Item out of stock.";
    }

    return <span className="stock">{text}</span>;
  };


  displayStock = () => {
    const { productStock } = this.state;

    let text = "";

    if (productStock > 10) {
      text = "In Stock";
    }
    else if (productStock > 0) {
      text = `Only ${productStock} items left!`;
    } else if (productStock === 0) {
      text = "Item out of stock.";
    }
    return <span className="stock">{text}</span>;
  }

  //add item to user's cart
  addItem = () => {
    //check if user is logged in
    if (this.state.login === false) {
      alert("please login to add to cart");
    } else if (this.state.amtPurchased <= 0) {
      alert("Sorry, cannot add a quantity of 0.");
    }

    //check if quantity exceeded stock
    else if (this.state.amtPurchased > Number(this.state.productStock)) {
      alert("Quantity exceeded stock amount");
    }

    //add to user's cart
    else {
      //update user's cart on server
      var apiURL = "/api/getUserCart/addItems";
      //item added to user's cart is not an apparel
      if (this.state.isApparel === false) {
        axios
          .post(apiURL, {
            params: {
              user: this.props.user,
              pid: this.props.pid,
              amtPurchased: this.state.amtPurchased,
              vendorID: this.state.vid,
              image: this.state.imageLink,
              isApparel: this.state.isApparel
            }
          })
          .then(res => {
            if (res.data.success === true) {
              //after adding to item, get updated cart
              const getCartURL = "/api/getUserCart";
              axios
                .get(getCartURL, {
                  params: {
                    user: this.props.user
                  }
                })
                .then(res => {
                  //after getting cart info, update redux store container
                  this.props.updateItems(res.data.data);
                  alert("Item added to cart!");
                })
                .catch(err => {
                  alert(err);
                });
            }
          })
          .catch(err => {
            alert(err);
          });
      }

      //item added to user's cart is an apparel
      else {
        console.log("checking shirt size", this.state.size);
        axios
          .post(apiURL, {
            params: {
              user: this.props.user,
              pid: this.props.pid,
              amtPurchased: this.state.amtPurchased,
              vendorID: this.state.vid,
              image: this.state.imageLink,
              isApparel: this.state.isApparel,
              s_stock: this.state.s_stock,
              m_stock: this.state.m_stock,
              l_stock: this.state.l_stock,
              xs_stock: this.state.xs_stock,
              xl_stock: this.state.xl_stock,
              size: this.state.size
            }
          })
          .then(res => {
            if (res.data.success === true) {
              //after adding to item, get updated cart
              const getCartURL = "/api/getUserCart";
              axios
                .get(getCartURL, {
                  params: {
                    user: this.props.user
                  }
                })
                .then(res => {
                  //after getting cart info, update redux store container
                  this.props.updateItems(res.data.data);
                  alert("Item added to cart!");
                })
                .catch(err => {
                  alert(err);
                });
            }
          })
          .catch(err => {
            alert(err);
          });
      } //end of else statement for isApparel
    } //end of else statement for adding to user's cart
  }; //end of addItem function

  //increase number of quantity to add to user's cart
  addQuantity = () => {
    var currentQuantity = this.state.amtPurchased;
    currentQuantity += 1;
    this.setState({
      amtPurchased: currentQuantity
    });
  };

  //remove number of quantity to add to user's cart
  removeQuantity = () => {
    var currentQuantity = this.state.amtPurchased;
    //can't have negative amount of items selected
    if (currentQuantity <= 1) {
      alert("Must have at least one item");
    } else {
      currentQuantity -= 1;
      this.setState({
        amtPurchased: currentQuantity
      });
    }
  };

  //handle select when user selects shirt size
  handleSelect = () => {
    this.setState({
      size: this.selectedSize.value
    });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleQuantityChange = event => {
    if (event.target.value < 0) {
      this.setState({ amtPurchased: 0 });
    } else {
      this.setState({ amtPurchased: event.target.value });
    }
  };

  //load item info by calling getProductInfo api and render to screen
  componentDidMount() {
    const apiURL = "/api/getProductInfo";
    axios
      .get(apiURL, {
        params: {
          pid: this.props.pid
        }
      })
      .then(res => {
        //if successfully got product info, update component
        if (res.data.success === true) {
          //update state of component
          console.log("checking response for is apparel ", res.data.product);
          if (res.data.product.isApparel === true) {
            this.setState({
              productInfo: res.data.product.productInfo,
              productName: res.data.product.productName,
              productPrice: res.data.product.productPrice,
              imageLink: res.data.product.productPicture,
              productStock: res.data.product.productStock,
              vid: res.data.product.vid,
              isApparel: true,
              s_stock: res.data.product.s_stock,
              m_stock: res.data.product.m_stock,
              l_stock: res.data.product.l_stock,
              xs_stock: res.data.product.xs_stock,
              xl_stock: res.data.product.xl_stock,
              size: res.data.product.size
            });
          } else {
            this.setState({
              productInfo: res.data.product.productInfo,
              productName: res.data.product.productName,
              productPrice: res.data.product.productPrice,
              imageLink: res.data.product.productPicture,
              productStock: res.data.product.productStock,
              vid: res.data.product.vid
            });
          }
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  render() {
    if (this.state.isApparel === false) {
      return (
        <section className="item-detailed-container">
          <ItemImageViewer imageLink={this.state.imageLink} />
          <ItemInfo
            productName={this.state.productName}
            productPrice={this.state.productPrice}
            productInfo={this.state.productInfo}
            handleQuantityChange={this.handleQuantityChange}
            addItem={this.addItem}
            displayStock={this.displayStock}
            amtPurchased={this.state.amtPurchased}
          />
        </section>
      );
    } else {
      return (
        <section className="item-detailed-container">
          <ItemImageViewer imageLink={this.state.imageLink} />
          <ApparelItemInfo
            productName={this.state.productName}
            productPrice={this.state.productPrice}
            productInfo={this.state.productInfo}
            handleQuantityChange={this.handleQuantityChange}
            handleChange={this.handleChange}
            addItem={this.addItem}
            displayApparelStock={this.displayApparelStock}
            amtPurchased={this.state.amtPurchased}
            size={this.state.size}
          />
        </section>
      );
    }
  }
}

//obtain state from store as props for component
//get login value and user email
const mapStateToProps = state => {
  return {
    pid: state.selectedItem.selectedItemID,
    login: state.auth.login,
    user: state.auth.user
  };
};

//dispatch action to reducer
//update which item was selected for detailed view of item
const mapDispatchToProps = dispatch => {
  return {
    //get user's cart from state after logging in
    updateItems: response =>
      dispatch({
        type: actions.GET_CART,
        cart: response
      })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShopItemDetailed);
