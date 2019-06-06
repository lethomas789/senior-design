import React, { Component } from "react";
import "./Privacy.css";

export default class Privacy extends Component {
  render() {
    return (
      <div>
        <div className="privacy-header">
          <h1>Privacy Policy</h1>
          This Privacy Policy describes how your personal information is
          collected, used, and shared when you visit or make a purchase from
          193ecommerce.com (the “Site”).
        </div>
        <div className="each-question">
          <h2>PERSONAL INFORMATION WE COLLECT</h2>
          <p>
            When you visit the Site, we automatically collect certain
            information about your device, including information about some of
	    the cookies that are installed on your device. Additionally, as you 
	    browse the Site, we collect information about the about how you interact
	    with the Site. We refer to this automatically-collected information as 
	    “Device Information”.
          </p>
        </div>

        <div className="each-question">
          <p>
            We collect Device Information using the following technologies: 
	  </p>
	  <p>- “Cookies” are data files that are placed on your device or computer
            and often include an anonymous unique identifier. For more
            information about cookies, and how to disable cookies, visit
            http://www.allaboutcookies.org.</p>
        </div>

        <div className="each-question">
          Additionally when you make a purchase or attempt to make a purchase
          through the Site, we collect certain information from you, including
          your name, billing address, shipping address, payment information
          (including credit card numbers), and email address. We refer to this 
	  information as “Order Information”. When we talk about
          “Personal Information” in this Privacy Policy, we are talking both
          about Device Information and Order Information.
        </div>

        <div className="each-question">
          <h2>HOW DO WE USE YOUR PERSONAL INFORMATION</h2>
          <p>
            We use the Order Information that we collect generally to fulfill
            any orders placed through the Site (including processing your
            payment information, arranging for shipping, and providing you with
            invoices and/or order confirmations). Additionally, we use this
            Order Information to:
          </p>
          <p>- Communicate with you;</p>
          <p>- Screen our orders for potential risk or fraud; and</p>
          <p>
            - When in line with the preferences you have shared with us, provide
            you with information or advertising relating to our products or
            services.
          </p>
          We use the Device Information that we collect to help us screen for
          potential risk and fraud, and more generally to improve and optimize our Site.
        </div>
        <div className="each-question">
          <h2>SHARING YOUR PERSONAL INFORMATION</h2>
          <p>
            Finally, we may also share your Personal Information to comply with
            applicable laws and regulations, to respond to a subpoena, search
            warrant or other lawful request for information we receive, or to
            otherwise protect our rights.
          </p>
        </div>

        <div className="each-question">
          <h2>DO NOT TRACK</h2>
          <p>
            Please note that we do not alter our Site’s data collection and use
            practices when we see a Do Not Track signal from your browser.
          </p>
        </div>

        <div className="each-question">
          <h2>DATA RETENTION</h2>
          <p>
            When you place an order through the Site, we will maintain your
            Order Information for our records unless and until you ask us to
            delete this information.
          </p>
        </div>

        <div className="each-question">
          <h2>CHANGES</h2>
          <p>
            We may update this privacy policy from time to time in order to
            reflect, for example, changes to our practices or for other
            operational, legal or regulatory reasons.
          </p>
        </div>

        <div className="each-question">
	  <h2>MINORS</h2>
          <p>
            The Site is not intended for individuals under the age of 16.
          </p>
        </div>

        <div className="each-question">
        <div className = "last-question">
          <h2>CONTACT US</h2>
          <p>
            For more information about our privacy practices, if you have
            questions, or if you would like to make a complaint, please contact
            us by e‑mail at ecs193.ecommerce@gmail.com
          </p>
        </div>
        </div>
      </div>
    );
  }
}
