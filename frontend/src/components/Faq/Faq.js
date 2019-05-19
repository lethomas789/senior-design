import React, {Component, Fragment } from "react";
import "./Faq.css";

export default class Privacy extends Component {
  render(){
    return(
      <div>
        <h1> Frequently Asked Questions </h1>
	<h2> Where do I go to pick up my products? </h2>
	<p> Products purchased on this website are picked up on campus unless
	    otherwise noted by the vendor </p>
	<h2> Do you have a refund policy? </h2>
	<p> There is no refund policy, products are not returnable after purchase
	</p>
	<h2> Who should I contact if I have any questions/issues with my product? </h2> 
	<p> Please contact the vendor directly if there any questions or issues with the product
	</p>

	<h2> I am a vendor and I am interested in selling my products here </h2>
	<p> Thank you for your interest, please send us an email at ecs193.ecommerce@gmail.com
	    where we can go over the setting up process
	</p>

	<h2> How can I contact you guys? </h2>
	<p> You can send us an email at ecs193.ecommerce@gmail.com </p>
      </div>
    )
  }
}

