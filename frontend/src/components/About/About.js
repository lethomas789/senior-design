import React, { Component } from "react";
import "./About.css";

export default class About extends Component {
  render() {
    return (
      <div className="about-container">
        <header className="about-header">
          <div>HEADER HERE</div>
          <div>SOME SORT OF TAGLINE HERE</div>
        </header>
        <div className="about-main-image">
          IMAGE TEXT HERE
        </div>
        <section className="about-info">
          ABOUT INFO Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Iure dolorum neque dolore! Tempora iste in aliquam non illo nihil ut
          eligendi nam praesentium earum. Facere dolorum praesentium adipisci
          alias dolore.
        </section>
        <section className="about-link-box about-link-box-1">BOX 1</section>
        <section className="about-link-box about-link-box-2">BOX 2</section>
        <section className="about-contact-box">
          BOX TO HOLD CONTACT US INFO?
        </section>
        <div className="about-bottom-image">
          BOTTOM IMAGE ------------------------------------------------------
        </div>
      </div>
      /*
      <div>
        <Grid container direction="column" justify="center"alignContent = "center" alignItems="center">
        <div className = "aboutBox">
        <div className = "plsCenter">

          <h1 id = "aboutHeader"> About Us </h1>
         
          <p>We are a group of Computer Science seniors and this website is our senior design final project.
            From a technical standpoint, our goal was to make a site with secure end to end transactions using
            modern technologies such as React, Node, Firebase, and Google Cloud Services. We utilize https protocols 
            and the PayPal API to accomplish this. We aimed to create user and admin accounts with different privileges
            while utilizing Oauth 2.0 to enhance userability. 
          </p>

          <p>The goals of our class is to respond to an open-ended interdisciplinary computer-science related design problem,
            develop a precise problem statement, propose a design that solves the problem, implement a prototype design, and validate
            the design and report on the results. We learn the complete process of a computational problem solving by 
            experiencing the complete process of creating an initial design, implementing it, and reporting the results. 
            We learn to function in a team-oriented problem-solving environment, and learn the issues that are involved
            with the implementation process of large-scale.
          </p>
          <img src={require('../../images/ourgroup.png')} width="100%" height = "100%"/>
          </div>
          </div>
          
        </Grid>
      </div>
      */
    );
  }
}
