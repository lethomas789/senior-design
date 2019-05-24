import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "../OrderHistory/OrderHistory.css";
import { connect } from "react-redux";
import actions from "../../store/actions";
import axios from "axios";
import OrderHistoryItem from "../OrderHistoryItem/OrderHistoryItem.js";
import Button from "@material-ui/core/Button";
// import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

class OrderHistoryView extends Component {
  state = {
    type: "",
    orders: []
  };

  componentDidMount() {
    // orderhistory/:type/:vid

    const { type } = this.props.match.params.type;

    this.setState({ type });

    let apiURL = "";

    if (type === "user") {
      apiURL = "/api/orders/getUserOrders";
      axios
        .get(apiURL, {
          withCredentials: true
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
          console.log(err);
          this.props.notifier({
            title: "Error",
            message: err.toString(),
            type: "warning"
          });
        });
    } else if (type === "admin") {
    }
  }

  render() {
    const { type } = this.props.match.params.type;

    // if on user route and not admin, display UserOrders component
    if (type === "user" && !this.props.isAdmin) {
      return ( <UserOrders/>);
    }
    else if (type === "user" && this.props.isAdmin) {

    }

    return <div />;
  }
}

class UserOrders extends Component {
  state = {
      orders: [],
      date: "asc", // default date to ascending order
      pickedUp: "all",
      search: "",
      searchValue: "",
      typingTimeout: 0,

  }
  render() {
    if (this.state.orders.length === 0) {
      return (
        <div id="order-history-container">
          <div className="order-history-center">
            <h1> No orders were made! </h1>
          </div>
        </div>
      );
    }

    let filteredOrders = this.state.orders;

    if (this.state.pickedUp !== "all") {
      filteredOrders = filterOrders(
        filteredOrders,
        "pickedUp",
        this.state.pickedUp,
        this.updateParent
      );
    }

    // filter by search and pickedUp
    if (this.state.search !== "") {
      filteredOrders = searchOrders(filteredOrders, this.state.search);
    }

    // reverse array if descending
    if (this.state.date === "desc") {
      filteredOrders = [...filteredOrders].reverse();
    }

    // finally render the filtered orders into OrderHistoryItems
    filteredOrders = this.renderOrders(
      filteredOrders,
      "user",
      "null",
      this.props.notifier,
      this.updateParent
    );

    return (
      <div>
        <h1 className="centerHeader"> Orders </h1>
        <div className="centerize">
          <div className="centerize">
            {/********* filter buttons ********************/}

            <div id="order-history-filters-container">
              {/* filter by date: asc/desc */}
              <form autoComplete="off">
                <InputLabel
                  htmlFor="date"
                  style={{ fontFamily: "Proxima Nova" }}
                >
                  Date:
                </InputLabel>
                <Select
                  value={this.state.date}
                  onChange={this.handleChange}
                  inputProps={{ name: "date", id: "date" }}
                  style={{
                    margin: "16px 10px 0px 10px",
                    fontFamily: "Proxima Nova"
                  }}
                >
                  <MenuItem value="asc" style={{ fontFamily: "Proxima Nova" }}>
                    Ascending
                  </MenuItem>
                  <MenuItem value="desc" style={{ fontFamily: "Proxima Nova" }}>
                    Descending
                  </MenuItem>
                </Select>
              </form>

              {/* filter by picked up true/false */}
              <form autoComplete="off">
                <InputLabel
                  htmlFor="pickedUp"
                  style={{ fontFamily: "Proxima Nova" }}
                >
                  Picked Up:
                </InputLabel>
                <Select
                  value={this.state.pickedUp}
                  onChange={this.handleChange}
                  inputProps={{ name: "pickedUp", id: "pickedUp" }}
                  style={{
                    margin: "16px 10px 0px 10px",
                    fontFamily: "Proxima Nova"
                  }}
                >
                  <MenuItem value="all" style={{ fontFamily: "Proxima Nova" }}>
                    Display All
                  </MenuItem>
                  <MenuItem value={true} style={{ fontFamily: "Proxima Nova" }}>
                    Yes
                  </MenuItem>
                  <MenuItem
                    value={false}
                    style={{ fontFamily: "Proxima Nova" }}
                  >
                    No
                  </MenuItem>
                </Select>
              </form>

              {/* search by item name in order */}
              <form noValidate autoComplete="off">
                <TextField
                  label="Search by Item Name"
                  value={this.state.searchValue}
                  onChange={this.handleSearch}
                  style={{ fontFamily: "Proxima Nova" }}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Return array of all orders that have a certain filterValue
 *
 * @param {array} orders - array of order objects
 * @param {string} filter - property of order obj to check
 * @param {any} filterValue - value to check filter against
 */
function filterOrders(orders, filter, filterValue) {
  if (orders.length === 0 || orders === undefined) {
    return [];
  }

  let history = orders.filter(order => {
    if (order[filter] === filterValue) {
      return true;
    }
    return false;
  });

  return history;
}

/**
 * Returns of an array of order objects filtered by item names containing the
 * search substring
 *
 * @param {array} orders - array of order objects
 * @param {string} searchValue - substring to search item name by
 */
function searchOrders(orders, searchValue) {
  if (orders.length === 0 || orders === undefined) {
    return [];
  }

  let history = orders.filter(order => {
    // true if any item name in order contains search substring
    let hasSearch = order.items.some(item => {
      return item.name.toLowerCase().includes(searchValue);
    });

    return hasSearch;
  });

  return history;
}

//obtain state from store as props for component
//get cart items, login value, and user email
const mapStateToProps = state => {
  return {
    login: state.auth.login,
    user: state.auth.user,
    isAdmin: state.auth.isAdmin,
    adminsOf: state.auth.adminsOf
  };
};

export default connect(mapStateToProps)(OrderHistoryView);
