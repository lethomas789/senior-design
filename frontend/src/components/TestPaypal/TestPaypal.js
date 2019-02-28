import React, { Component } from 'react'
import PaypalExpressBtn from 'react-paypal-express-checkout';

export default class TestPaypal extends Component {
  render() {
    const onSuccess = (payment) => {
      // 1, 2, and ... Poof! You made it, everything's fine and dandy!
      console.log("Payment successful!", payment);
      // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
      // alert('Transaction completed by ' + payment.email);
    }

    const onCancel = (data) => {
      // The user pressed "cancel" or closed the PayPal popup
      console.log('Payment cancelled!', data);
      // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
    }

    const onError = (err) => {
      // The main Paypal script could not be loaded or something blocked the script from loading
      console.log("Error!", err);
      // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
      // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
    }

    let env = 'sandbox'; // you can set this string to 'production'
    let currency = 'USD'; // you can set this string from your props or state  
    let total = 0.01;  // this is the total amount (based on currency) to charge
    // Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/

    // TODO DO NOT CODE IN YOUR APP ID, LINK TO A FILE THAT IS GIT IGNORED
    const client = {
      // sandbox: 'YOUR-SANDBOX-APP-ID',
      sandbox: 'AQRbJx9R02PGD4hvGRQlGL48Ri1mvf4c7qd6LzuNHqmbtothVDp-vI6K7qatzi3dgYcg4tkp5lpXHBye',
      production: 'YOUR-PRODUCTION-APP-ID',
    }
    // In order to get production's app-ID, you will have to send your app to Paypal for approval first
    // For your sandbox Client-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App" unless you have already done so):
    //   => https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
    // Note: IGNORE the Sandbox test AppID - this is ONLY for Adaptive APIs, NOT REST APIs)
    // For production app-ID:
    //   => https://developer.paypal.com/docs/classic/lifecycle/goingLive/

    let paymentOptions = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": "localhost:3000", // send back to localhosts
        "cancel_url": "localhost:3000/testPaypal"
      },
      "transactions": [{
        "item_list": {
          "items": [{
            "name": "item",
            "sku": "item",
            "price": "1.00",
            "currency": "USD",
            "quantity": 1
          }]
        },
        "amount": {
          "currency": "USD",
          "total": "0.01"
        },
        "description": "This is the payment description."
      }]
    };

    // NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!
    return (
      <PaypalExpressBtn env={env} client={client} currency={currency} total={total} onError={onError} onSuccess={onSuccess} onCancel={onCancel} shipping={1}/>
      // shipping = {1} means no shipping 
    );
  }
}
