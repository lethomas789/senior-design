import React, { Component, Fragment } from "react";
import "./Checkout.css";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import actions from "../../store/actions";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
// import PaypalExpressBtn from "react-paypal-express-checkout";
import PaypalButton from "../PaypalButton/PaypalButton";
import axios from "axios";
import { withRouter, Redirect } from 'react-router-dom';

//styles for checkout button
const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
});

//calculate total price of user's cart and allow user to checkout
//get user's cart info from state
//state consists of information needed for paypal checkout

//modified component to account for each vendor
//old code takes total cart items and price
//difference is that each vendor has its own list of items and total price of items
class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: this.props.totalValue,
      env: process.env.REACT_APP_PAYPAL_ENV,
      currency: "USD",
      client: {
        sandbox: process.env.REACT_APP_PAYPAL_SANDBOX,
        production: "YOUR-PRODUCTION-APP-ID"
      },
      paymentOptions: {
        intent: "sale",
        // "payer": {
        //   "payer_info": {  // payer_info not saved to paypal transaction, will need to send email to vendor with transaction ID for cross reference
        //     "email": "tst@gmail.com",
        //     "first_name": "a",
        //     "last_name": "d"
        //   },
        //   "payment_method": "paypal"
        // },
        redirect_urls: {
          return_url: "www.google.com",
          cancel_url: "www.reddit.com"
        },
        transactions: [],
        note_to_payer: "Pickup the sale at this location:" // does a popup, not incuded in transaction on paypal
      },
      // cartTotal: this.props.total
      cartTotal: this.props.totalValue
    };
  }

  //convert items in cart to array of paypal objects for payment option
  updateCheckoutParams() {
    //array to store as payment option
    var paypalTransactionsArray = [];
    var paypalTransactions = {};
    paypalTransactions.item_list = {};
    paypalTransactions.amount = {};
    paypalTransactions.description = "Sale";

    var paypalItems = [];

    //go through each item in redux store
    for (let i = 0; i < this.props.cartItems.length; i++) {
      let paypalItem = {};

      //construct new paypal object based on each item in Redux store container
      paypalItem.name = this.props.cartItems[i].productName;
      paypalItem.price = String(
        this.props.cartItems[i].productPrice.toFixed(2)
      );
      paypalItem.currency = this.state.currency;
      paypalItem.quantity = String(this.props.cartItems[i].amtPurchased);

      //store
      paypalItems.push(paypalItem);
    }

    paypalTransactions.item_list.items = paypalItems;
    paypalTransactions.amount.currency = this.state.currency;
    paypalTransactions.amount.total = String(this.props.totalValue);

    //update payment options to be list of paypal items
    paypalTransactionsArray.push(paypalTransactions);
    this.state.paymentOptions.transactions = paypalTransactionsArray;

    //update transaction total based on total summed from items for each vendor
    this.state.paymentOptions.transactions[0].amount.total = this.props.totalValue;
    this.state.paymentOptions.transactions[0].amount.total = String(
      this.props.totalValue
    );
  }

  componentDidMount() {
    this.updateCheckoutParams();
  }

  // //update payment option on update
  componentDidUpdate() {
    this.updateCheckoutParams();
    // this.state.paymentOptions.transactions[0].amount.total = this.props.totalValue;
    // this.state.paymentOptions.transactions[0].amount.total = String(
    //   this.props.totalValue
    // );
  }

  //subtract stock for single item
  subtractStockSingleItem = (item) => {
    return new Promise( (resolve,reject) => {
      const apiURL = '/api/stock';

      //convert Size to apparel stock, eg. Small -> s_stock
      var sizeStock = '';
      switch(item.size){
        case 'Small':
          sizeStock = 's_stock';
          break;
    
        case 'Medium':
          sizeStock = 'm_stock';
          break;
    
        case 'Large':
          sizeStock = 'l_stock';
          break;
    
        case 'X-Large':
          sizeStock = 'xl_stock';
          break;
            
        case 'X-Small':
          sizeStock = 'xs_stock';
          break;
    
        default:
          sizeStock = '';
          break;
      }

      //make request to subtract stock on server
      axios.patch(apiURL, {
        params:{
          pid: item.pid,
          isApparel: item.isApparel,
          size: sizeStock,
          amt: item.amtPurchased
        }
      })
      .then(res => {
        //if subtraction successful, resolve promise
        if(res.data.success === true){
          resolve(1);
        }
        //if error, reject promise
        else{
          reject(0);
        }
      })
      .catch(err => {
        reject(0);
      })
    })
  }

  //wait for all items to complete stock subtraction
  subtractStock = () => {
    var waitPromises = [];
    var currentVendorItems = this.props.cartItems;

    //for each item, subtract stock, create a promise for each
    for(let i = 0; i < currentVendorItems.length; i++){
      waitPromises.push(this.subtractStockSingleItem(currentVendorItems[i]));
    }

    //subtract stock and then remove items from cart
    Promise.all(waitPromises)
      .then(res => {
        //delete items from vendor in user's cart after successfully subtracting stock
        this.removeItemsFromVendor();
      })
      .catch(err => {
        this.props.notifier({
          title: "Error",
          message: err.toString(),
          type: "danger"
        });
      })
  }

  //remove each item from vendor after purchase
  //create a promise for each item, call /api/getUserCart/deleteItems to delete each item
  removeSingleItemFromVendor = (removeItem) => {
    return new Promise( (resolve, reject) => {
      const apiURL = "/api/getUserCart/deleteItems";

      axios.post(apiURL, {
        params:{
          user: this.props.user,
          pid: removeItem.pid,
          isApparel: removeItem.isApparel,
          size: removeItem.size
        }
      })
      .then(res => {
        //item was deleted on server, resolve promise
        if(res.data.success === true){
          resolve(1);
        }
        else{
          //if item was not deleted, reject promise
          reject(0);
        }
      })
      .catch(err => {
        reject(0);
      })
    }); 
  }

  //remove items from vendor after purchase
  //wait for all promises to return, and then update user's cart
  removeItemsFromVendor = () => {
    var waitPromises = [];
    var currentVendorItems = this.props.cartItems;

    //create a promise for each item to be deleted and wait
    for(let i = 0; i < currentVendorItems.length; i++){
      waitPromises.push(this.removeSingleItemFromVendor(currentVendorItems[i]));
    }

    //wait until all promises have been resolved
    Promise.all(waitPromises)
      //when all promises have been resolved, proceed to get updated user's cart
      .then(res => {  
        //after removing items from user's cart with vendor item, get updated cart
        const cartURL = '/api/getUserCart';
        axios.get(cartURL, {
          params:{
            user: this.props.user
          }
        })
        .then(res => {
          if(res.data.success === true){
            //update new items and redirect to successful payment page
            this.props.updateItems(res.data.data);
            window.location = '/successfulPayment';
          }
          else{
            this.props.notifier({
              title: "Error",
              message: "Error with server, no cart.",
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
      })
      .catch(err => {
        this.props.notifier({
          title: "Error",
          message: err.toString(),
          type: "danger"
        });
      })
  }

  onSuccess = payment => {
    console.log("Payment successful!", payment);
    this.props.updateSelectedVendor(this.props.cartItems[0].vid);
    const apiURL = "/api/orders";

    //make post request to orders
    axios
      .post(apiURL, {
        params: {
          items: this.state.paymentOptions.transactions[0].item_list.items,
          totalPrice: String(this.props.totalValue),
          vid: this.props.cartItems[0].vid,
          user: this.props.user,
          paymentID: payment.paymentID,
          payerID: payment.payerID
        }
      })
      .then(res => {
        //on successful payment
        if (res.data.success === true) {
          this.props.notifier({
            title: "Success",
            message: res.data.message.toString(),
            type: "success"
          });

          //subtract stock from database after items have been processed for checkout
          //remove items that are based on vendor after purchase
          //call api to delete item from cart on server

          //subtract stock removes stock from database and calls removeItemsFromVendor()
          this.subtractStock();

          // this.removeItemsFromVendor();

          // //clear cart on server
          // const clearcartURL = "/api/getUserCart/clearCart";
          // axios
          //   .delete(clearcartURL, {
          //     params: {
          //       user: this.props.user
          //     }
          //   })
          //   .then(res => {
          //     if (res.data.success === true) {
          //       //when payment is successfully processed, clear cart and set total to 0
          //       this.props.emptyCartOnPayment();
          //       this.props.clearTotalOnPayment(0);
          //       window.location = '/successfulPayment';
          //     } else {
          //       this.props.notifier({
          //         title: "Error",
          //         message: "Error with server.",
          //         type: "danger"
          //       });
          //     }
          //   })
          //   .catch(err => {
          //     this.props.notifier({
          //       title: "Error",
          //       message: err.toString(),
          //       type: "danger"
          //     });
          //   });
        } else {
          this.props.notifier({
            title: "Error",
            message: "Payment Unsuccessful",
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
      });

    // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
    // alert('Transaction completed by ' + payment.email);

    // TODO, payment contains info, send it to backend
    // payment.payerID
    // payment.paymentID

    // payment.returnUrl can be used to route back to somewhere
    // or route ourselves
  };

  onCancel = data => {
    // The user pressed "cancel" or closed the PayPal popup
    console.log("Payment cancelled!", data);
    // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
  };

  onNotEnoughStock = itemName => {
    console.log(
      "Payment canceled because there was not enough stock for:",
      itemName
    );

    this.props.notifier({
      title: "Error",
      message: `Sorry, ${itemName} has run out of stock.`,
      type: "danger"
    });
  };

  onError = err => {
    // The main Paypal script could not be loaded or something blocked the script from loading
    console.log("Error!", err);
    this.props.notifier({
      title: "Error",
      message: err.toString(),
      type: "danger"
    });
    // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
    // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
  };

  //TODO bugs
  //saved quantity selectors, update redux and server for cart
  //pass correct total to paypal checkout
  //check quantity of stock in database before proceeding with payment
  render() {
    const { classes } = this.props;

    return (
      <div>
        {/* <button onClick = {this.checkStock(this.props.items)}> Check Stock </button> */}
        <Fragment>
          {/* <PaypalExpressBtn */}
          <PaypalButton
            env={this.state.env}
            client={this.state.client}
            currency={this.state.currency}
            total={Number(this.props.totalValue)}
            onError={this.onError}
            onSuccess={this.onSuccess}
            onCancel={this.onCancel}
            shipping={1}
            paymentOptions={this.state.paymentOptions}
            items={this.props.items}
            onNotEnoughStock={this.onNotEnoughStock}
          />
        </Fragment>
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
      }),

    updateSelectedVendor: currentVendor =>
      dispatch({
        type: actions.GET_VENDOR_PRODUCTS,
        vendor: currentVendor
      }),

    emptyCartOnPayment: () =>
      dispatch({
        type: actions.EMPTY_CART
      }),

    clearTotalOnPayment: value =>
      dispatch({
        type: actions.UPDATE_TOTAL,
        total: value
      })
  };
};

/*Checkout.PropTypes = {
  classes: PropTypes.object.isRequired
};*/

// Checkout.PropTypes = {
//   classes: PropTypes.object.isRequired
// };

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Checkout)));
