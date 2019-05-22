import React, { Component } from "react";
import "./About.css";

export default class About extends Component {
  render() {
    return (
      <div className="parallax">
      <div className = "full-height">
      
      <div className = "greater-container">
      <div className="about-container">
      
        <header className="about-header">
          <div>About Us</div>
          {/* <div>4 students trying to inspire</div> */}
        </header>
        

        </div>
        </div>
      </div>
      <div className = "about-center">
     
        <section className="about-info">
        <div className = "about-info-text">
            We are a group of Computer Science seniors and this website is our senior design final project.
            From a technical standpoint, our goal was to make a site with secure end to end transactions using
            modern technologies such as React, Node, Firebase, and Google Cloud Services. 
            </div>
        </section>
        </div>

        </div>

    );
  }
}
