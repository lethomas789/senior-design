import React, { Component } from "react";
import "./Faq.css";

export default class Privacy extends Component {
  render() {
    return (
      <div>
        <div className="faq-container">
          <div className="faq-header">
            <h1> Frequently Asked Questions </h1>
          </div>

          <div className="each-question-faq">
            <h2> Where do I go to pick up my products? </h2>
            <p>
              Products purchased on this website are picked up on campus unless
              otherwise noted by the vendor
            </p>
          </div>

          <div className="each-question-faq">
            <h2> Is there a refund policy? </h2>
            <p>
              There is no refund policy, products are not returnable after
              purchase
            </p>
          </div>

          <div className="each-question-faq">
            <h2>
              Who should I contact if I have any questions/issues with my
              product?
            </h2>
            <p>
              Please contact the club/vendor directly if there any questions or
              issues with the product
            </p>
          </div>

          <div className="each-question-faq">
            <h2>
              I am a club/vendor and I am interested in selling on this platform
            </h2>
            <p>
              Thank you for your interest, please send us an email at
              ecs193.ecommerce@gmail.com to initiate the settup process.
            </p>
          </div>

          <div className="each-question-faq">
            <h2> How can I contact you ?</h2>
            <p> You can send us an email at ecs193.ecommerce@gmail.com </p>
          </div>
        </div>
      </div>
    );
  }
}
