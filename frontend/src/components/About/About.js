import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import './About.css';

export default class About extends Component {
  render() {
    return (
      <div>
        <Grid container direction="column" justify="center"alignContent = "center" alignItems="center">
        <div className = "aboutBox">
        <div className = "center">

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
    );
  }
}
