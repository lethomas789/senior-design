import React, { Component, Fragment } from "react";
import axios from "axios";
import "./CartItem.css";
import { connect } from "react-redux";
import actions from "../../store/actions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

//component to display cart objects
class CartItem extends Component {
  // store product id PID to reference for item removal
  state = {
    pid: this.props.pid,
    vid: this.props.vendorID,
    size: this.props.size,
    amtPurchased: this.props.amtPurchased,
    price: this.props.productPrice,
    total: this.props.totalPrice,
    stock: 0
  };

  //when a CartItem renders, store the state of the stock
  //local stock checking used to quantity selector check
  componentDidMount() {
    const apiURL = '/api/getProductInfo';
    axios.get(apiURL, {
      params:{
        pid: this.props.pid
      }
    })
    .then(res => {
      //extract stock info and store , check local stock
      this.setState({
        stock: res.data.product.stock
      })
    })
    .catch(err => {
      alert(err);
    })
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  // TODO figure out how we want to handle 0 change here
  //want to update total value of both item in cart and total sum
  handleQuantityChange = event => {
    //if the user wants to change quantity selector, check if value exceeds current stock
    if(event.target.value > this.state.stock){
      alert("Quantity exceeds stock");
      return;
    } 

    var newAmount = event.target.value;
    if (event.target.value < 0) {
      this.setState({ amtPurchased: 1 });
    } else {
      //calculate new total of specific item, where total = value * price
      var newTotal = event.target.value * this.state.price;
      this.setState({ 
        amtPurchased: event.target.value,
        total: newTotal
      }, () => {
        //update total in cart
        //update total and amount based on pid
        this.props.updateItemTotal(this.state.pid, newTotal, newAmount);
      });
    }
  };

  //remove item from user's cart
  removeItem = () => {
    const apiURL = "/api/getUserCart/deleteItems";
    axios
      .post(apiURL, {
        params: {
          user: this.props.user,
          pid: this.state.pid
        }
      })
      .then(res => {
        const getCart = "/api/getUserCart";
        //after successful deletion, get updated user's cart
        axios
          .get(getCart, {
            params: {
              user: this.props.user
            }
          })
          .then(res => {
            //after removing item from cart, update cart on server
            console.log("updating cartview cart", res.data);
            this.props.updateItems(res.data.data);

            //reload the page after deleting items to update carts of each vendor
            window.location.reload();
          })
          .catch(err => {
            alert(err);
          });
      })
      .catch(err => {
        alert(err);
      });
  };

  render() {
    const { imageSrc, productName, size } = this.props;

    const { amtPurchased } = this.state;

    // const productPrice = this.props.productPrice.toFixed(2);
    // const totalPrice = this.props.totalPrice.toFixed(2);

    const productPrice = this.state.price;
    const totalPrice = this.state.total;

    return (
      <div className="cart-row-container">
        <div className="cart-item-container">
          <img src={imageSrc} className="cart-img" alt={`${productName}`} />
          <div className="cart-item-info">
            <div>
              <b>{`${productName}`}</b>
            </div>
            {size ? (
              <div>
                <b>Size</b>: {`${size}`}
              </div>
            ) : (
              ""
            )}
            <Button size="small" color="primary" onClick={this.removeItem} id="btn-remove">
              Remove Item
            </Button>

          </div>
        </div>

        <div>${productPrice}</div>

        <TextField
          className="cart-qty"
          value={amtPurchased}
          onChange={this.handleQuantityChange}
          type="number"
          InputLabelProps={{ shrink: true}}
        />

        <div>${totalPrice}</div>
      </div>
    );
  }
}

//obtain state from store as props for component
//get cart items, login value, and user email
const mapStateToProps = state => {
  return {
    items: state.cart.items,
    login: state.auth.login,
    user: state.auth.user
  };
};

//redux
//dispatch action to reducer, get user's cart from store
const mapDispatchToProps = dispatch => {
  return {
    updateItems: response =>
      dispatch({
        type: actions.GET_CART,
        cart: response
      }),

    //update store of cart total
    updateTotal: sum =>
      dispatch({
        type: actions.UPDATE_TOTAL,
        total: sum
      })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartItem);
