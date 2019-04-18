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
    amtPurchased: 0,
    price: this.props.productPrice,
    total: this.props.totalPrice
  };

  componentDidMount() {
    this.setState({ amtPurchased: this.props.amtPurchased });
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  // TODO figure out how we want to handle 0 change here
  //want to update total value of both item in cart and total sum
  handleQuantityChange = event => {
    if (event.target.value < 0) {
      this.setState({ amtPurchased: 1 });
    } else {
      var newTotal = event.target.value * this.state.price;
      this.setState({ 
        amtPurchased: event.target.value,
        total: newTotal
      }, () => {
        //update total in cart
        this.props.updateItemTotal(this.state.pid, newTotal);
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
            this.props.updateItems(res.data.data);
            //get total from items
            var currentCart = res.data.data;
            var priceTotal = 0;

            //if cart is empty, total price is $0
            if (currentCart.length === 0) {
              console.log("cart is empty");
              this.props.updateTotal(priceTotal);
            }

            //if there are items, calculate total price
            else {
              console.log("cart is not empty");
              for (let i = 0; i < currentCart.length; i++) {
                priceTotal += Number(currentCart[i].totalPrice);
              }
              console.log(priceTotal);
              this.props.updateTotal(priceTotal);
            }
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
