import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "./OrderHistory.css";
import { connect } from "react-redux";
import actions from "../../store/actions";
import axios from "axios";
import OrderHistoryItem from "../OrderHistoryItem/OrderHistoryItem.js";
import Button from "@material-ui/core/Button";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

class OrderHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      show: "user",  // which order history to show
      date: "asc",   // default date to ascending order
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

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
          this.props.notifier({
            title: "Error",
            message: res.data.message.toString(),
            type: "warning"
          });
        }
      })
      .catch(err => {
        this.props.notifier({
          title: "Error",
          message: err.toString(),
          type: "warning"
        });
      });
  }

  render() {
    const { isAdmin, adminsOf } = this.props;

    const orders = this.state.orders.map(order => {

      let convertDate = new Date(order.date);
      let hours = convertDate.getHours();
      let timeOfDay = "AM";


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
        <Fragment key={order.oid}>
          <OrderHistoryItem
            key={order.oid}
            orderDate={actualDate}
            email={order.email}
            firstName={order.firstName}
            lastName={order.lastName}
            oid={order.oid}
            paid={String(order.paid)}
            pickedUp={String(order.pickedUp)}
            totalPrice={order.totalPrice}
            clubHistory={false} // TODO figure out how to pass admin club version
            items={order.items}
          />
        </Fragment>
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
          <h1 className="centerHeader"> Orders </h1>
          {/**
           * TODO
           * take out paid,
           * put in email
           * differentiate user orders vs club orders for admin
           * filter/search order history
           */}

          {/* if admin, display button to switch to logged in user orders */}
          {isAdmin ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.setState({ show: "user" })}
              key="user"
            >
              User Orders
            </Button>
          ) : (
            ""
          )}

          {/* if admin, display buttons to switch to club orders */}
          {isAdmin
            ? adminsOf.map(vendor => (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.setState({ show: vendor.vid })}
                  key={vendor.vid}
                >
                  {vendor.vendorName} Orders
                </Button>
              ))
            : ""}

          {/* filter buttons */}
          <form autoComplete="off">
            <InputLabel htmlFor="date">Date</InputLabel>
            <Select
              value={this.state.date}
              onChange={this.handleChange}
              inputProps={{ name: 'date', id: 'date', }}
            >
              <MenuItem value="asc"> Ascending </MenuItem>
              <MenuItem value="desc"> Descending </MenuItem>
            </Select>
          </form>

          {/* below displays the actual order histories */}
          {isAdmin
            ? adminsOf.map((vendor, index) => (
                <ClubOrders
                  key={index}
                  vid={vendor.vid}
                  vendorName={vendor.vendorName}
                  notifier={this.props.notifier}
                  show={this.state.show}
                  date={this.state.date}
                />
              ))
            : ""}


          {/* this user orders */}
          {this.state.show === "user" ? (
            <div id="order-history-container" key="user-orders">{orders}</div>
          ) : (
            ""
          )}
        </div>
      );
    }
  }
}

class ClubOrders extends Component {
  static propTypes = {
    // vendors: PropTypes.array.isRequired,
    notifier: PropTypes.func.isRequired,
    vid: PropTypes.string.isRequired,
    vendorName: PropTypes.string.isRequired,
    show: PropTypes.string,
    date: PropTypes.string.isRequired,
  };

  state = {
    orders: [],
    display: true
  };

  componentDidMount() {
    const apiURL = "/api/orders/getVendorOrders";
    axios
      .post(apiURL, { params: { vid: this.props.vid } })
      .then(res => {
        if (res.data.success) {
          this.setState({
            orders: res.data.orders
          });
        } else {
          this.props.notifier({
            title: "Error",
            message: res.data.message.toString(),
            type: "warning"
          });
        }
      })
      .catch(err => {
        console.log("Error in ClubOrders:", err);
        this.props.notifier({
          title: "Error",
          message: err.toString(),
          type: "danger"
        });
      });
  }

  render() {
    const { vendorName, show, vid, date } = this.props;

    let orders = this.state.orders.map(order => {
      let convertDate = new Date(order.date);
      let hours = convertDate.getHours();
      let timeOfDay = "AM";

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
        <Fragment key={order.oid}>
          <OrderHistoryItem
            key={order.oid}
            orderDate={actualDate}
            email={order.email}
            firstName={order.firstName}
            lastName={order.lastName}
            oid={order.oid}
            paid={String(order.paid)}
            pickedUp={String(order.pickedUp)}
            totalPrice={order.totalPrice}
            clubHistory={false} // TODO figure out how to pass admin club version
            items={order.items}
          />
        </Fragment>
      );
    });

    if (date === 'desc') {
      orders = [...orders].reverse()
    }

    if (show === vid) {
      return (
        <div>
          {vendorName}
          {orders}
        </div>
      );
    }

    return null;
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
    cart: state.cart.items,
    isAdmin: state.auth.isAdmin,
    adminsOf: state.auth.adminsOf
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
