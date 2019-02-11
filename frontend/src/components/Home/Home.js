import React, { Component } from 'react';
import './Home.css';
import Grid from '@material-ui/core/Grid';


export default class Home extends Component {
  render() {
    return (
      <div id = "homeContainer">
        <Grid container direction="column" justify="center"alignContent = "center" alignItems="center">
          <h1> Welcome to ECS193 ECommerce! </h1>
          <p>This is a ecommerce website for UC Davis's clubs. 
          Here we make merchandise available from all different clubs of Davis.</p>
        </Grid>
      </div>
    );
  }
}



