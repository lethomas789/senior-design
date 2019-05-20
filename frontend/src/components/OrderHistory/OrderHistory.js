import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "./OrderHistory.css";
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

class OrderHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      show: "user", // which order history to show
      date: "asc", // default date to ascending order
      pickedUp: "all",
      search: "",
      searchValue: "",
      typingTimeout: 0,
      updateParent: false
    };
  }

  updateParent = () => {
    console.log("I AM CALLED 1");
    this.setState({ updateParent: true });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSearch = event => {
    // reset typing timeout
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    // put dealy on changing search state to account for user typing;
    // done so that the component doesnt try to rerender for every letter
    this.setState({
      searchValue: event.target.value.toLowerCase(),
      typingTimeout: setTimeout(() => {
        this.setState(() => ({ search: this.state.searchValue }));
      }, 300)
    });
    // this.setState({ search: event.target.value.toLowerCase() });
  };

  /**
   * Return array OrderHistoryItem to be rendered to the page
   *
   * @param {array} orders - array of order objects
   */
  renderOrders = (orders, index, vid = "null", notifier, updateOrder) => {
    let renderedOrders;

    if (orders.length === 0 || orders === undefined) {
      return <div id="order-history-container">None</div>;
    }

    renderedOrders = orders.map(order => {
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

      // let seconds = String(convertDate.getSeconds());

      let actualDate =
        convertDate.toDateString() +
        " " +
        hours +
        ":" +
        minutes +
        " " +
        timeOfDay;

      return (
        <Fragment key={`${order.oid}-${index}`}>
          <OrderHistoryItem
            key={`${order.oid}-${index}`}
            orderDate={actualDate}
            email={order.email}
            firstName={order.firstName}
            lastName={order.lastName}
            oid={order.oid}
            paid={String(order.paid)}
            pickedUp={order.pickedUp}
            totalPrice={order.totalPrice}
            items={order.items}
            notifier={notifier}
            vid={vid}
            updateOrder={updateOrder}
          />
        </Fragment>
      );
    });

    return renderedOrders;
  };

  componentDidMount() {
    const apiURL = "/api/orders/getUserOrders";
    console.log('HISTORY MOUNTED');

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
  }

  render() {
    const { isAdmin, adminsOf } = this.props;

    if (this.state.orders.length === 0) {
      return (
        <div id="order-history-container">
          <h1> No orders were made! </h1>
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
            style={{ marginLeft: "10px" }}
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
                style={{ marginLeft: "10px" }}
              >
                {vendor.vendorName} Orders
              </Button>
            ))
          : ""}

        {/********* filter buttons ********************/}

        <div id="order-history-filters-container">
          {/* filter by date: asc/desc */}
          <form autoComplete="off">
            <InputLabel htmlFor="date">Date:</InputLabel>
            <Select
              value={this.state.date}
              onChange={this.handleChange}
              inputProps={{ name: "date", id: "date" }}
              style={{ margin: "16px 10px 0px 10px" }}
            >
              <MenuItem value="asc"> Ascending </MenuItem>
              <MenuItem value="desc"> Descending </MenuItem>
            </Select>
          </form>

          {/* filter by picked up true/false */}
          <form autoComplete="off">
            <InputLabel htmlFor="pickedUp">Picked Up:</InputLabel>
            <Select
              value={this.state.pickedUp}
              onChange={this.handleChange}
              inputProps={{ name: "pickedUp", id: "pickedUp" }}
              style={{ margin: "16px 10px 0px 10px" }}
            >
              <MenuItem value="all"> Display All </MenuItem>
              <MenuItem value={true}> Yes </MenuItem>
              <MenuItem value={false}> No </MenuItem>
            </Select>
          </form>

          {/* search by item name in order */}
          <form noValidate autoComplete="off">
            <TextField
              label="Search by Item Name"
              value={this.state.searchValue}
              onChange={this.handleSearch}
            />
          </form>
        </div>

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
                pickedUp={this.state.pickedUp}
                search={this.state.search}
                renderOrders={this.renderOrders}
              />
            ))
          : ""}

        {/* this user orders */}
        {this.state.show === "user" ? (
          <div id="order-history-items-container" key="user-orders">
            {filteredOrders}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

class ClubOrders extends Component {
  static propTypes = {
    // vendors: PropTypes.array.isRequired,
    notifier: PropTypes.func.isRequired,
    vid: PropTypes.string.isRequired,
    vendorName: PropTypes.string.isRequired,
    show: PropTypes.string,
    date: PropTypes.string.isRequired
    // pickedUp: PropTypes.bool.isRequired
  };

  state = {
    orders: [],
    display: true,
    updateParent: false
  };

  updateParent = () => {
    console.log("I AM CALLED 2");
    this.forceUpdate();
    // this.setState({ updateParent: true })
  };

  updateOrder = (oid, pickedUp) => {
    const index = this.state.orders.findIndex(order => order.oid === oid);
    const newArr = this.state.orders;
    newArr[index].oid = oid;
    newArr[index].pickedUp = pickedUp;
    this.setState(() => ({ orders: newArr }));
  };

  componentDidMount() {
    const apiURL = "/api/orders/getVendorOrders";
    axios
      .post(apiURL, { withCredentials: true, params: { vid: this.props.vid } })
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
    const { vendorName, show, vid, date, pickedUp, search } = this.props;

    let filteredOrders = this.state.orders;

    if (show !== vid) {
      return null;
    }

    // TODO pickedUp toggling fixes

    if (pickedUp !== "all") {
      filteredOrders = filterOrders(filteredOrders, "pickedUp", pickedUp);
    }

    // filter by search and pickedUp
    if (search !== "") {
      filteredOrders = searchOrders(filteredOrders, search);
    }

    // reverse array if descending
    if (date === "desc") {
      filteredOrders = [...filteredOrders].reverse();
    }

    // finally render the filtered orders into OrderHistoryItems
    filteredOrders = this.props.renderOrders(
      filteredOrders,
      vendorName,
      vid,
      this.props.notifier,
      this.updateOrder
    );

    return (
      <div id="order-history-container">
        {vendorName}
        {filteredOrders}
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
    user: state.auth.user,
    total: state.cart.total,
    cart: state.cart.items,
    isAdmin: state.auth.isAdmin,
    adminsOf: state.auth.adminsOf,
    token: state.auth.token
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
