import React, { Component } from 'react'
import PaypalExpressBtn from 'react-paypal-express-checkout';

export default class TestPaypal extends Component {
  render() {
    const onSuccess = (payment) => {
      // 1, 2, and ... Poof! You made it, everything's fine and dandy!
      console.log("Payment successful!", payment);
      // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
      // alert('Transaction completed by ' + payment.email);
      
      // TODO, payment contains info, send it to backend
      // payment.payerID
      // payment.paymentID

      // payment.returnUrl can be used to route back to somewhere
      // or route ourselves
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
    let total = 1.00;  // this is the total amount (based on currency) to charge
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
        "payer_info": {  // payer_info not saved to paypal transaction, will need to send email to vendor with transaction ID for cross reference
          "email": "test@example.com",
          "first_name": "Raymond",
          "last_name": "Hong"
        }

        // "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": "www.google.com", 
        "cancel_url": "www.reddit.com",
        // "return_url": "http:localhost:3000", // send back to localhosts
        // "cancel_url": "http:localhost:3000/testPaypal"
      },
      "transactions": [{
        "item_list": {
          "items": [{
            "name": "test paymentID = transactionID",
            // "sku": "p0",  // stock keeping unit, 
            "price": "1.00",
            "currency": "USD",
            "quantity": 1
          }]
        },
        "amount": {
          "currency": "USD",
          "total": "1.00"
        },
        "description": "This is a sale.",  // purchase description; memo for vendor
      }],
      "note_to_payer": "Pickup the sale at this location:"  // does a popup, not incuded in transaction on paypal
    };

    // NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!
    return (
      // shipping = {1} means no shipping
      <div>
        <PaypalExpressBtn env={env} client={client} currency={currency}
        total={total} onError={onError} onSuccess={onSuccess}
        onCancel={onCancel} shipping={1} paymentOptions={paymentOptions} />

        <br></br>

        <PaypalExpressBtn env={env} client={client} currency={currency}
        total={total} onError={onError} onSuccess={onSuccess}
        onCancel={onCancel} shipping={1} />
      </div>

    );
  }
}

