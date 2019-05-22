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
    itemID: this.props.itemID,
    vid: this.props.vendorID,
    size: this.props.size,
    amtPurchased: this.props.amtPurchased,
    price: this.props.productPrice,
    total: this.props.totalPrice,
    stock: 0,
    isApparel: this.props.isApparel
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
      this.props.notifier({
        title: "Error",
        message: err.toString(),
        type: "danger"
      });
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
      //added notifier to indicate if user is exceeding stock of item based on quantity selector
      this.props.notifier({
        title: "Warning",
        message: "Quantity exceeds stock",
        type: "warning"
      });
      //if exceeded, return
      return;
    } 

    //if not exceeded, proceed with updating new total/amount in cart
    //user cannot select 0 or negative items to purchase, need at least 1
    var newAmount = event.target.value;
    if (event.target.value < 1) {
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
        this.props.updateItemTotal(this.state.itemID, newTotal, newAmount);
        
        //update cart on server with new amount 
        var updateURL = '/api/getUserCart/updateItems';
        axios.post(updateURL, {
          withCredentials: true,
          params:{
            pid: this.state.pid,
            amtPurchased: newAmount,
            isApparel: this.state.isApparel,
            size: this.state.size
          }
        })
        .then(res => {
          if(res.data.success === false){
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
        })
      });
    }
  };

  //remove item from user's cart
  removeItem = () => {
    const apiURL = "/api/getUserCart/deleteItems";
    axios
      .post(apiURL, {
        withCredentials: true,
        params: {
          pid: this.state.pid,
          isApparel: this.state.isApparel,
          size: this.state.size
        }
      })
      .then(res => {
        const getCart = "/api/getUserCart";
        //after successful deletion, get updated user's cart
        axios
          .get(getCart, {
            withCredentials: true,
          })
          .then(res => {
            //after removing item from cart, update cart on server
            this.props.updateItems(res.data.data);

            //get all items related to this vendor and update vendor cart
            var newItemsAfterDeletion = [];

            var amtPurchased = 0;
            for(let i = 0; i < res.data.data.length; i++){
              amtPurchased = amtPurchased + res.data.data[i].amtPurchased
            }

            //update cart badge based on number of items in user's cart
            this.props.updateAmountPurchased(amtPurchased);


            //remove vendor from view if no more items
            if(res.data.data.length != 0){
              for(let i = 0; i < res.data.data.length; i++){
                if (res.data.data[i].vid === this.state.vid){
                  newItemsAfterDeletion.push(res.data.data[i]);
                }
              }
              this.props.updateCartAfterDelete(newItemsAfterDeletion);
            }

            //update list of vendor items after item removal, no more items in vendor, empty
            else{
              this.props.updateCartAfterDelete(res.data.data);
            }
          })
          .catch(err => {
            this.props.notifier({
              title: "Error",
              message: err.toString(),
              type: "danger"
            });
          });
      })
      .catch(err => {
        this.props.notifier({
          title: "Error",
          message: err.toString(),
          type: "danger"
        });
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
    login: state.auth.login
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
      }),

    updateAmountPurchased: amount => 
      dispatch({
        type: actions.UPDATE_AMOUNT_PURCHASED,
        amountPurchased: amount
      }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartItem);
