import React from "react";
import ReactDOM from "react-dom";
import scriptLoader from "react-async-script-loader";
import paypal from "paypal-checkout";
import axios from "axios";

// const scriptLoader = require('react-async-script-loader');
// const paypal = require('paypal-checkout'); 
 
const PPBtn = paypal.Button.driver("react", { React, ReactDOM });

class PaypalButton extends React.Component {
  state = {
    showButton: false,
    errorItem: ""
  };

  asyncItemStockCheck = item => {
    return new Promise((resolve, reject) => {
      axios
        .get("/api/stock/", {
          params: {
            pid: item.pid,
            isApparel: item.isApparel,
            size: item.size,
            amt: item.amtPurchased
          }
        })
        .then(res => {
          if (res.data.availableStock === false) {
            reject(item.productName);
          } else {
            resolve("Stock available");
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  };

  checkStock = items => {
    // check stock for each item
    var promises = [];
    for (let i = 0; i < items.length; i++) {
      promises.push(this.asyncItemStockCheck(items[i]));
    }
    return Promise.all(promises);
    /*
    Promise.all(promises)
      .then(values => {
        console.log("All items stock available.");
        return true;
      })
      .catch(errorItem => {
        console.log("Not enough stock for:", errorItem);
        // this.setState({ errorItem: errorItem });
        this.props.onNotEnoughStock(errorItem);
        return false;
      });
      */
  };

  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;

    if (isScriptLoaded && isScriptLoadSucceed) {
      this.setState({ showButton: true });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { isScriptLoaded, isScriptLoadSucceed } = nextProps;

    const isLoadedButWasntLoadedBefore =
      !this.state.showButton && !this.props.isScriptLoaded && isScriptLoaded;

    if (isLoadedButWasntLoadedBefore) {
      if (isScriptLoadSucceed) {
        this.setState({ showButton: true });
      }
    }
  }

  render() {
    const {
      total,
      currency,
      env,
      commit,
      client,
      onSuccess,
      onError,
      onCancel,
      items,
      onNotEnoughStock
    } = this.props;

    const { showButton } = this.state;
    console.log("ITEMS: ", items);

    const payment = () =>
      paypal.rest.payment.create(env, client, {
        transactions: [
          {
            amount: {
              total,
              currency
            }
          }
        ]
      });

    // onAuthorize occurs once the user authorizes the purchase by choosing payment type
    const onAuthorize = (data, actions) => {
      this.checkStock(items)
        .then(res => {
          // if all promises resovlve
          console.log("Check Stock Successful, proceeding to execute payment.");
          actions.payment
            .execute()
            .then(() => {
              const payment = {
                paid: true,
                cancelled: false,
                payerID: data.payerID,
                paymentID: data.paymentID,
                paymentToken: data.paymentToken,
                returnUrl: data.returnUrl
              };

              onSuccess(payment);
            })
            .catch(err => {
              console.log("Error in paypal payment execution:", err);
              this.props.notifier({
                title: 'Error',
                message: 'Sorry, there was an error. Please contact the support email for help.',
                type: 'danger',
                duration: 5000,
              });
            });
        })
        // if any of the promises reject
        .catch(errorItem => {
          console.log("Not enough stock for:", errorItem);
          // this.setState({ errorItem: errorItem });
          onNotEnoughStock(errorItem);
          onCancel(payment);
        });
      /*
      const availableStock = await this.checkStock(items);
      console.log(availableStock);
      this.checkStock(items).then(res => {
        console.log("DONE");
        console.log(res);
        if (res === true) {
          console.log("success");
          actions.payment.execute().then(() => {
            const payment = {
              paid: true,
              cancelled: false,
              payerID: data.payerID,
              paymentID: data.paymentID,
              paymentToken: data.paymentToken,
              returnUrl: data.returnUrl
            };

            onSuccess(payment);
          });
        } else {
          onCancel(payment);
          // alert(`Sorry, ${this.state.errorItem} has run out of stock.`);
          // onNotEnoughStock(this.state.errorItem);
        }
      });
      */
    };

    return (
      <div>
        {showButton && (
          <PPBtn
            env={env}
            client={client}
            commit={commit}
            payment={payment}
            onAuthorize={onAuthorize}
            onCancel={onCancel}
            onError={onError}
          />
        )}
      </div>
    );
  }
}

export default scriptLoader("https://www.paypalobjects.com/api/checkout.js")(
  PaypalButton
);
