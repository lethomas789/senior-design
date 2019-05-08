import React, { Component } from 'react';
import './SuccessfulPayment.css';

class SuccessfulPayment extends Component {
  render() {
    return (
      <div id = "payment-successful-container">
        <h1 id = "payment-succesful-content"> Payment Succesful! Check your e-mail inbox for purchase verification! </h1>
      </div>
    )
  }
}

export default SuccessfulPayment;
