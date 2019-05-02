import React, { Component } from "react";
import Cart from "../Cart/Cart";
import axios from "axios";
import { connect } from "react-redux";
import actions from "../../store/actions";
import "./CartView.css";
import AddShoppingCart from "@material-ui/icons/AddShoppingCart";

//split cart into groups, grouped by vendors
//each subcart has items, subtotal, and checkout button

class CartView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allItems: this.props.items,
      allVendors: [],
      vendorItemsSeparated: []
    };
  }

  //pass list of vendors to function to categorize items
  separateItems = vendorList => {
    //array that consists of arrays of items
    //array that holds arrays
    var itemsArray = [];

    //for each vendor in the vendor list, determine which items have matching vid and push to temp array
    for (let i = 0; i < vendorList.length; i++) {
      //current vendor to check, temp array
      const currentVendor = vendorList[i];
      var currentItems = new Array();

      //for each item in cart, determine which vid matches current vendor that is being checked
      for (let j = 0; j < this.props.items.length; j++) {
        if (this.props.items[j].vid === currentVendor) {
          currentItems.push(this.props.items[j]);
        }
      }

      //push current array of items to array of arrays
      itemsArray.push(currentItems);
    }

    //update state
    this.setState(
      {
        vendorItemsSeparated: itemsArray
      },
      () => {
        console.log("vendor items", this.state.vendorItemsSeparated);
      }
    );
  };

  //function to separate items by vendors
  separateVendors = () => {
    //separate payment by vid
    //find which vendors exist, array to keep track existing vendors
    var currentVendorArray = [];

    //go through each item in user's cart, extract vid to determine how many vendors to create buttons for
    for (let i = 0; i < this.props.items.length; i++) {
      const currentVid = this.props.items[i].vid;
      if (currentVendorArray.includes(currentVid) === false) {
        currentVendorArray.push(currentVid);
      }
    }

    //store result of array of vendors available
    this.setState(
      {
        allVendors: currentVendorArray
      },
      () => {
        console.log("determine which vids were found ", this.state.allVendors);
      }
    );

    //call function to separate items based on vendor
    this.separateItems(currentVendorArray);
  };

  //
  componentDidMount() {
    this.separateVendors();
  }

  componentDidUpdate() {}

  render() {
    console.log('HERE');
    console.log(this.state.allVendors);

    // if empty cart, display empty cart text
    if (this.state.allVendors.length === 0) {
      var renderCarts = (
        <div id='empty-cart'>
          No items in cart.
          <AddShoppingCart style={{width: "400px", height: "400px"}}/>
        </div>
      )


    }
    else {
    //render carts for each vendor
    var renderCarts = this.state.allVendors.map(cart => {
      //for each vendor, want to render a cart
      for (let i = 0; i < this.state.vendorItemsSeparated.length; i++) {
        var currentListItems = this.state.vendorItemsSeparated[i];
        if (currentListItems[0].vid === cart) {
          return (
            <Cart
              passedItems={currentListItems}
              passedVendor={cart}
              notifier={this.props.notifier}
            />
          );
        }
      }
    });

    }

    return <div>{renderCarts}</div>;
  }
}

//dispatch action to reducer, get user's cart
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

    //update cart
    updateCart: cart =>
      dispatch({
        type: actions.UPDATE_CART,
        items: cart
      })
  };
};

//obtain state from store as props for component
//get cart items, login value, and user email
const mapStateToProps = state => {
  return {
    items: state.cart.items,
    login: state.auth.login,
    user: state.auth.user
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartView);
