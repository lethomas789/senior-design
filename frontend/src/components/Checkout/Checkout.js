import React, { Component } from 'react';
import './Checkout.css';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import axios from 'axios';

//styles for checkout button
const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

//calculate total price of user's cart and allow user to checkout
//get user's cart info from state
//state consists of information needed for paypal checkout
class Checkout extends Component {
  constructor(props){
    super(props);
    this.state = {
      total: this.props.total,
      env: "sandbox",
      currency: "USD",
      client: {
        sandbox: 'AQRbJx9R02PGD4hvGRQlGL48Ri1mvf4c7qd6LzuNHqmbtothVDp-vI6K7qatzi3dgYcg4tkp5lpXHBye',
        production: 'YOUR-PRODUCTION-APP-ID',
      },
      paymentOptions: {
        "intent": "sale",
        // "payer": {
        //   "payer_info": {  // payer_info not saved to paypal transaction, will need to send email to vendor with transaction ID for cross reference
        //     "email": "tst@gmail.com",
        //     "first_name": "a",
        //     "last_name": "d"
        //   },
        //   "payment_method": "paypal"
        // },
        "redirect_urls": {
          "return_url": "www.google.com", 
          "cancel_url": "www.reddit.com",
        },
        "transactions": [],
        "note_to_payer": "Pickup the sale at this location:"  // does a popup, not incuded in transaction on paypal
      },
      cartTotal: this.props.total
    }
  }

  //convert items in cart to array of paypal objects for payment option
  componentDidMount(){
    //array to store as payment option
    var paypalTransactionsArray= [];
    var paypalTransactions = {};
    paypalTransactions.item_list = {};
    paypalTransactions.amount = {};
    paypalTransactions.description = "Sale";

    var paypalItems = [];

    //go through each item in redux store
    for(let i = 0; i < this.props.cart.length; i++){
      let paypalItem = {};

      //construct new paypal object based on each item in Redux store container
      paypalItem.name = this.props.cart[i].productName;
      paypalItem.price = String(this.props.cart[i].productPrice.toFixed(2));
      paypalItem.currency = this.state.currency;
      paypalItem.quantity = String(this.props.cart[i].amtPurchased);

      //store 
      paypalItems.push(paypalItem);
    }

    paypalTransactions.item_list.items = paypalItems;
    paypalTransactions.amount.currency = this.state.currency;
    paypalTransactions.amount.total = String(this.props.total.toFixed(2));
    //paypalTransactions.amount.total = String(this.state.total.toFixed(2));

    //update payment options to be list of paypal items
    console.log(this.state.paymentOptions.transactions);
    paypalTransactionsArray.push(paypalTransactions);
    this.state.paymentOptions.transactions = paypalTransactionsArray;
  }

  //update payment option on update
  componentDidUpdate(){
    console.log("THIS IS THE TOTAL PLEASE FIX STATE", this.props.total);
    this.state.paymentOptions.transactions[0].amount.total = this.props.total;
    this.state.paymentOptions.transactions[0].amount.total = String(this.props.total);
    console.log("testing payment options ", this.state.paymentOptions);
  }

  onSuccess = (payment) => {
    console.log("Payment successful!", payment);
    console.log(this.props.cart);
    this.props.updateSelectedVendor(this.props.cart[0].vid);

    const apiURL = "http://localhost:4000/api/orders";

    axios.post(apiURL, {
      params:{
        items: this.state.paymentOptions.transactions[0].item_list.items,
        totalPrice: String(this.props.total),
        vid: this.props.cart[0].vid,
        user: this.props.user,
        paymentID: payment.paymentID,
        payerID: payment.payerID
      }
    })
    .then(res => {
      if(res.data.success === true){
        alert(res.data.message);
      }

      else{
        alert("Error with sending order");
      }
    })
    .catch(err => {
      alert(err);
    })

    // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
    // alert('Transaction completed by ' + payment.email);
    
    // TODO, payment contains info, send it to backend
    // payment.payerID
    // payment.paymentID

    // payment.returnUrl can be used to route back to somewhere
    // or route ourselves
  }

  onCancel = (data) => {
    // The user pressed "cancel" or closed the PayPal popup
    console.log('Payment cancelled!', data);
    // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
  }

  onError = (err) => {
    // The main Paypal script could not be loaded or something blocked the script from loading
    console.log("Error!", err);
    alert(err);
    // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
    // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
  }

  render() {
    const { classes } = this.props;

    return(
      <div>
        <Grid container direction="row">
          <h1> Total: ${this.props.total} </h1>
          <PaypalExpressBtn env={this.state.env} client={this.state.client} currency={this.state.currency}
            total={Number(this.props.total)} onError={this.onError} onSuccess={this.onSuccess}
            onCancel={this.onCancel} shipping={1} paymentOptions={this.state.paymentOptions} />
        </Grid>
      </div>
    );
  }
}

//obtain state from store as props for component
//get cart items, login value, and user email
const mapStateToProps = state => {
  return{
    items: state.cart.items,
    login: state.auth.login,
    user: state.auth.user,
  //  total: state.cart.total,
    cart: state.cart.items
  }
}

//redux
//dispatch action to reducer, get user's cart from store
const mapDispatchToProps = dispatch => {
  return{
    updateItems: (response) => dispatch({
      type: actions.GET_CART,
      cart: response
    }),

    updateSelectedVendor: (currentVendor) => dispatch({
      type: actions.GET_VENDOR_PRODUCTS,
      vendor: currentVendor
    })
  }
}

Checkout.PropTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Checkout));
