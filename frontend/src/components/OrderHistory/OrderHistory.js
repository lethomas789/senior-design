import React, { Component } from "react";
import "./OrderHistory.css";
import { connect } from "react-redux";
import actions from "../../store/actions";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import OrderHistoryItem from "../OrderHistoryItem/OrderHistoryItem.js";

class OrderHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: []
    };
  }

  componentDidMount() {
    const apiURL = "/api/orders/getUserOrders";

    axios
      .get(apiURL, {
        params: {
          user: this.props.user
        }
      })
      .then(res => {
        if (res.data.success === true) {
          this.setState({
            orders: res.data.orders
          });
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  render() {
    const orders = this.state.orders.map(order => {
      console.log(order.date);

      let convertDate = new Date(order.date);
      let hours = convertDate.getHours();
      let timeOfDay = "AM";

      console.log("hours ", hours);

      if (hours > 12) {
        hours = hours - 12;
        timeOfDay = "PM";
      }

      hours = String(hours);

      let minutes = String(convertDate.getMinutes());

      if (minutes.length === 1) {
        minutes = "0" + minutes;
      }

      let seconds = String(convertDate.getSeconds());

      let actualDate =
        convertDate.toDateString() +
        " " +
        hours +
        ":" +
        minutes +
        " " +
        timeOfDay;

      return (
        <OrderHistoryItem
          orderDate={actualDate}
          email={order.email}
          firstName={order.firstName}
          lastName={order.lastName}
          oid={order.oid}
          paid={String(order.paid)}
          pickedUp={String(order.pickedUp)}
          totalPrice={order.totalPrice}
        />
      );
    });

    if (this.state.orders.length === 0) {
      return (
        <div>
          <h1> No orders were made! </h1>
        </div>
      );
    } else {
      return (
        <div>
          <h1> Orders: </h1>
          {/**
           * TODO
           * take out paid,
           * put in email
           * differentiate user orders vs club orders for admin
           * filter/search order history
           */}
          <div id="order-history-container">{orders}</div>
        </div>
      );
    }
  }
}

//obtain state from store as props for component
//get cart items, login value, and user email
const mapStateToProps = state => {
  return {
    items: state.cart.items,
    login: state.auth.login,
    user: state.auth.user,
    total: state.cart.total,
    cart: state.cart.items
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
      })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderHistory);
