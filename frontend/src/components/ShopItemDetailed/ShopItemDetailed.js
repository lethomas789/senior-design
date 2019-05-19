import React, { Component, Fragment } from "react";
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
import { Link } from "react-router-dom";

class CarouselImage extends Component {
  handleClick = () => {
    this.props.onClick(this.props.index);
  };

  render() {
    const { src, index, isActive } = this.props;

    return (
      <img
        key={index}
        data-index={index}
        className={isActive ? "selected-carousel-img" : "carousel-img"}
        src={src}
        alt={`Product Img${index}`}
        onClick={this.handleClick}
      />
    );
  }
}

class ItemImageViewer extends Component {
  static propTypes = {
    imageLink: PropTypes.array.isRequired
  };

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

  changeImage = index => {
    // console.log('click event');
    // console.log(e.target.getAttribute('data-index'));
    this.setState({
      // currentImage: e.target.getAttribute("data-index")
      currentImage: index
    });
  };

  render() {
    const { imageLink } = this.props;
    return (
      <section className="item-image-container">
        <div className="carousel-container">
          {imageLink.map((src, index) => (
            <CarouselImage
              key={index}
              index={index}
              src={src}
              isActive={this.state.currentImage === index}
              onClick={this.changeImage}
            />
          ))}
        </div>

        <div className="magnify-container">
          <ReactImageMagnify
            {...{
              smallImage: {
                alt: "Test Image",
                isFluidWidth: true,
                src: imageLink[this.state.currentImage]
              },
              largeImage: {
                src: imageLink[this.state.currentImage],
                width: 1200,
                height: 1800,
                enlargedImagePosition: "over"
              },
              enlargedImageContainerStyle: {
                zIndex: 10000 // set so enlarged image always display above
              }
            }}
          />
        </div>
      </section>
    );
  }
}

class ApparelItemInfo extends Component {
  static propTypes = {
    productName: PropTypes.string.isRequired,
    productPrice: PropTypes.number.isRequired,
    productInfo: PropTypes.string.isRequired,
    amtPurchased: PropTypes.number.isRequired,
    handleQuantityChange: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    displayApparelStock: PropTypes.func.isRequired,
    size: PropTypes.string.isRequired,
    clubName: PropTypes.string.isRequired
  };

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
      clubName
    } = this.props;

    return (
      <section className="item-info">
        <h2> {productName} </h2>
        <div className="price">${Number(productPrice).toFixed(2)}</div>
        <div>
          {this.props.size === "None" ? ( 
            <Fragment>
              <b>Availability</b>: Please select a size first.
            </Fragment>
          ) : (
            <Fragment>
              <b>Availability</b>: {displayApparelStock()}
            </Fragment>
          )}
          <p>
            <b>Club: </b>
            <Link to={`/vendorProducts/${this.props.vendorID}`}>
              {clubName}
            </Link>
          </p>
        </div>
        <p className="description">{productInfo}</p>

        <div className="select-container">
          {/* TODO fix selector */}
          <form autoComplete="off">
            <FormControl className="select-size">
              <InputLabel htmlFor="select-size">Select Size</InputLabel>
              <Select value={size} onChange={handleChange("size")} name="size">
                <MenuItem value="None">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="X-Small"> X-Small </MenuItem>
                <MenuItem value="Small"> Small </MenuItem>
                <MenuItem value="Medium"> Medium </MenuItem>
                <MenuItem value="Large"> Large </MenuItem>
                <MenuItem value="X-Large"> X-Large </MenuItem>
              </Select>
            </FormControl>
          </form>

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

class ItemInfo extends Component {
  //props for ItemInfo
  static propTypes = {
    productName: PropTypes.string.isRequired,
    productPrice: PropTypes.number.isRequired,
    productInfo: PropTypes.string.isRequired,
    amtPurchased: PropTypes.number.isRequired,
    handleQuantityChange: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    displayStock: PropTypes.func.isRequired,
    clubName: PropTypes.string.isRequired
  };

  render() {
    const {
      productName,
      productPrice,
      productInfo,
      amtPurchased,
      handleQuantityChange,
      addItem,
      displayStock,
      clubName
    } = this.props;

    return (
      <section className="item-info">
        <h2> {productName} </h2>
        <div className="price">${Number(productPrice).toFixed(2)}</div>
        <div>
          <b>Availability</b>: {displayStock()}
          <p>
            <b>Club</b>:
            <Link to={`/vendorProducts/${this.props.vendorID}`}>
              {clubName}
            </Link>
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

class ShopItemDetailed extends Component {
  // TODO update add item behavior for apparel; either frontend or backend or
  // both
  state = {
    imageLink: [],
    productInfo: "",
    productName: "",
    productPrice: "",
    amtPurchased: 1,
    vendor: "",
    productStock: "",
    isApparel: false,
    s_stock: 0,
    m_stock: 0,
    l_stock: 0,
    xs_stock: 0,
    xl_stock: 0,
    size: "None",
    currentImage: 0,
    vendorNames: [],
    vid: "",
    pid: ""
  };

  //display stock based on number of items available for each apparel
  //display number if less than 10
  displayApparelStock = () => {
    const { xs_stock, s_stock, m_stock, l_stock, xl_stock } = this.state;
    var totalStock = xs_stock + s_stock + m_stock + l_stock + xl_stock;

    //display stock based on size selected
    switch(this.state.size){
      case 'Small':
        totalStock = s_stock;
        break;

      case 'Medium':
        totalStock = m_stock;
        break;

      case 'Large':
        totalStock = l_stock;
        break;

      case 'X-Small':
        totalStock = xs_stock;
        break;

      case 'X-Large':
        totalStock = xl_stock;
        break;

      // when no size selected, do not display
      default:
        return;
    }

    let text = "";

    // available stock
    if (totalStock > 10) {
      text = "In Stock";
    }
    // less than 10, greater than 0, display alert
    else if (totalStock > 0) {
      text = `Only ${totalStock} item(s) left!`;
    } else if (totalStock === 0) {
      text = "Item out of stock.";
    } else {
      text = "Item out of stock."
    }

    return <span className="stock">{text}</span>;
  };

  displayStock = () => {
    const { productStock } = this.state;

    let text = "";

    if (productStock > 10) {
      text = "In Stock";
    } else if (productStock > 0) {
      text = `Only ${productStock} item(s) left!`;
    } else if (productStock === 0) {
      text = "Item out of stock.";
    } else {
      text = "Item out of stock."
    }
    return <span className="stock">{text}</span>;
  };

  addApparelToCart = () => {
    const apiURL = '/api/getUserCart/addItems';
    axios
      .post(apiURL, {
        withCredentials: true,
        params: {
          pid: this.props.pid,
          amtPurchased: this.state.amtPurchased,
          vendorID: this.state.vid,
          imageLink: this.state.imageLink,
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
              withCredentials: true
            })
            .then(res => {
              //after getting cart info, update redux store container
              this.props.updateItems(res.data.data);
              //switch from alert to notifier
              this.props.notifier({
                title: "Success",
                message: "Item added to cart!",
                type: "success"
              });
            })
            .catch(err => {
              this.props.notifier({
                title: "Error",
                message: err.toString(),
                type: "danger"
              });
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

  //add item to user's cart
  addItem = () => {
    //check if user is logged in
    if (this.state.login === false) {
      // alert("please login to add to cart");
      //switch from alert to notifier
      this.props.notifier({
        title: "Error",
        message: "Please login to add to cart.",
        type: "danger"
      });
    }

    //check if 0 products were purchased
    else if (this.state.amtPurchased <= 0) {
      // alert("Sorry, cannot add a quantity of 0.");
      //switch from alert to notifier
      this.props.notifier({
        title: "Error",
        message: "Cannot add a quantity of 0 to cart.",
        type: "danger"
      });
    }

    //check stock check for non apparel
    else if (
      this.state.amtPurchased > Number(this.state.productStock) &&
      this.state.isApparel === false
    ) {
      // alert("Quantity selected exceeds stock");
      //switch from alert to notifier
      this.props.notifier({
        title: "Error",
        message: "Quantity selected exceeds stock.",
        type: "danger"
      });

      //bug fix, when stock exceeds break from function execution
      return;
    }

    //check apparel stock
    else if (this.state.isApparel === true) {
      switch (this.state.size) {
        case "Small":
          if (this.state.amtPurchased > Number(this.state.s_stock)) {
            // alert("Quantity exceeds stock");
            this.props.notifier({
              title: "Error",
              message: "Sorry, not enough stock.",
              type: "danger"
            });
          }
          //add item to cart
          else{
            this.addApparelToCart();
          }
          break;

        case "Medium":
          if (this.state.amtPurchased > Number(this.state.m_stock)) {
            this.props.notifier({
              title: "Error",
              message: "Sorry, not enough stock.",
              type: "danger"
            });
          }
          else {
            // TODO add item
            this.addApparelToCart();
          }
          break;

        case "Large":
          if (this.state.amtPurchased > Number(this.state.l_stock)) {
            this.props.notifier({
              title: "Error",
              message: "Sorry, not enough stock.",
              type: "danger"
            });
          }

          else{
            this.addApparelToCart();
          }
          break;

        case "X-Small":
          if (this.state.amtPurchased > Number(this.state.xs_stock)) {
            this.props.notifier({
              title: "Error",
              message: "Sorry, not enough stock.",
              type: "danger"
            });
          }

          else{
            this.addApparelToCart();
          }
          break;

        case "X-Large":
          if (this.state.amtPurchased > Number(this.state.xl_stock)) {
            this.props.notifier({
              title: "Error",
              message: "Sorry, not enough stock.",
              type: "danger"
            });
          }

          else{
            this.addApparelToCart();
          }
          break;

        default:
          this.props.notifier({
            title: "Error",
            message: "Please select size!",
            type: "danger"
          });
      }
    }

    //add to user's cart
    else {
      //update user's cart on server
      var apiURL = "/api/getUserCart/addItems";
      //item added to user's cart is not an apparel
      if (this.state.isApparel === false) {
        axios
          .post(apiURL, {
            withCredentials: true,
            params: {
              pid: this.props.pid,
              amtPurchased: this.state.amtPurchased,
              vendorID: this.state.vid,
              imageLink: this.state.imageLink,
              isApparel: this.state.isApparel
            }
          })
          .then(res => {
            if (res.data.success === true) {
              //after adding to item, get updated cart
              const getCartURL = "/api/getUserCart";
              axios
                .get(getCartURL, {
                  withCredentials: true
                })
                .then(res => {
                  //after getting cart info, update redux store container
                  this.props.updateItems(res.data.data);
                  this.props.notifier({
                    title: "Success",
                    message: "Item added to cart.",
                    type: "success"
                  });
                })
                .catch(err => {
                  this.props.notifier({
                    title: "Error",
                    message: err.toString(),
                    type: "danger"
                  });
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

      //item added to user's cart is an apparel
      else {
        axios
          .post(apiURL, {
            withCredentials: true,
            params: {
              pid: this.props.pid,
              amtPurchased: this.state.amtPurchased,
              vendorID: this.state.vid,
              imageLink: this.state.imageLink,
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
                  //switch from alert to notifier
                  this.props.notifier({
                    title: "Success",
                    message: "Item added to cart!",
                    type: "success"
                  });
                })
                .catch(err => {
                  this.props.notifier({
                    title: "Error",
                    message: err.toString(),
                    type: "danger"
                  });
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
      } //end of else statement for isApparel
    } //end of adding item to cart
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
      //switch from alert to notifier
      this.props.notifier({
        title: "Error",
        message: "Can't remove, must have at least one item",
        type: "danger"
      });
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

  //user needs to purchase at least one item, can't have 0 or negative selected items
  handleQuantityChange = event => {
    if (event.target.value < 1) {
      this.setState({ amtPurchased: 1 });
    } else {
      this.setState({ amtPurchased: event.target.value });
    }
  };

  //load item info by calling getProductInfo api and render to screen
  componentDidMount() {
    //get list of vendor names
    const vendorAPI = "/api/getVendorInfo";

    //update state of vendors
    axios
      .get(vendorAPI)
      .then(res => {
        if (res.data.success === true) {
          //update list of vendors
          this.setState({
            vendorNames: res.data.vendors
          });

          //after getting list of vendors, make request to get product info

          //extract param values from URL
          //match object contains parameter values
          const handle = this.props.match.params;
          
          //update vid for redux, link to about page
          this.props.updateVendor(handle.vid);
          this.setState({
            vid: handle.vid,
            pid: handle.pid
          });

          //obtain item info from server based on matching pid
          //pid extracted from handle match object params
          const apiURL = "/api/getProductInfo";
          axios
            .get(apiURL, {
              params: {
                pid: handle.pid
              }
            })
            .then(res => {
              //if successfully got product info, update component
              if (res.data.success === true) {
                //get club name for this product
                var vendorName = "";

                //go through each vendor and check if vid matches item vid
                for (let i = 0; i < this.state.vendorNames.length; i++) {
                  //extract matching vid
                  if (this.state.vendorNames[i].vid === res.data.product.vid) {
                    vendorName = this.state.vendorNames[i].vendorName;
                  }
                }

                //if the product is an apparel
                if (res.data.product.isApparel === true) {
                  this.setState({
                    productInfo: res.data.product.productInfo,
                    productName: res.data.product.productName,
                    productPrice: res.data.product.productPrice,
                    imageLink: res.data.product.productPicture,
                    productStock: res.data.product.stock,
                    vendor: vendorName,
                    isApparel: true,
                    s_stock: res.data.product.s_stock,
                    m_stock: res.data.product.m_stock,
                    l_stock: res.data.product.l_stock,
                    xs_stock: res.data.product.xs_stock,
                    xl_stock: res.data.product.xl_stock
                  });
                } else {
                  this.setState({
                    productInfo: res.data.product.productInfo,
                    productName: res.data.product.productName,
                    productPrice: res.data.product.productPrice,
                    imageLink: res.data.product.productPicture,
                    productStock: res.data.product.stock,
                    vendor: vendorName
                  });
                }
              } else {
                alert(res.data.message);
                this.props.notifier({
                  title: "Success",
                  message: res.data.message.toString(),
                  type: "success"
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
      })
      //catch error for getting vendors
      .catch(err => {
        this.props.notifier({
          title: "Error",
          message: err.toString(),
          type: "danger"
        });
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
            clubName={this.state.vendor}
            vendorID={this.props.vendorID}
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
            clubName={this.state.vendor}
            vendorID={this.props.vendorID}
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
    vendorID: state.vendor.vendor
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
      }),

    updateVendor: newVendor =>
      dispatch({
        type: actions.GET_VENDOR_PRODUCTS,
        vendor: newVendor
      })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShopItemDetailed);
