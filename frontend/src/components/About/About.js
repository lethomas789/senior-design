import React, { Component } from "react";
import "./About.css";
import Hidden from "@material-ui/core/Hidden";


export default class About extends Component {
  render() {
    return (
      
      <div>
        <Hidden smDown>
      <div className="parallax">
      <div className = "full-height">
      
      <div className = "greater-container">
      <div className="about-container">
      
        <header className="hero-text">

          <div>About Us</div>

        </header>
        

        </div>
        </div>
      </div>
 
     
        <section className="about-info">
        <div className="helvv">
            <h2 className="decorated">
              <span>ECS193 E-COMMERCE</span>
            </h2>
          </div>
        <div className = "about-center">
        
        <div className = "about-info-text">
            We are a group of Computer Science seniors and this website is our senior design final project.
            From a technical standpoint, our goal was to make a site with secure end to end transactions using
            modern technologies such as React, Node, Firebase, and Google Cloud Services.
            </div>

            <div className = "about-info-text">
            Our motivation for this site is that UC Davis clubs typically have an unofficial way to sell their merchandise, usually through Facebook and word of mouth. 
            There is no easy way to display, buy and sell goods. 
            Our site is to provide a method to streamline this process. 
            </div>

            <div className = "about-info-text">
            If you have any more questions about our services, please visit our FAQ or contact us at ecs193.ecommerce@gmail.com
            
            </div>
            </div>
        </section>
        
        </div>
        </Hidden>
        <Hidden MediumUp>
        <section className="about-info">

            <h2>
              <span>ECS193 E-COMMERCE</span>
            </h2>

  
        
        <div className = "about-info-text">
            We are a group of Computer Science seniors and this website is our senior design final project.
            From a technical standpoint, our goal was to make a site with secure end to end transactions using
            modern technologies such as React, Node, Firebase, and Google Cloud Services.
            </div>

            <div className = "about-info-text">
            Our motivation for this site is that UC Davis clubs typically have an unofficial way to sell their merchandise, usually through Facebook and word of mouth. 
            There is no easy way to display, buy and sell goods. 
            Our site is to provide a method to streamline this process. 
            </div>

            <div className = "about-info-text">
            If you have any more questions about our services, please visit our FAQ or contact us at ecs193.ecommerce@gmail.com
            
            </div>
       
        </section>


        </Hidden>


        </div>
        

    );
  }
}
