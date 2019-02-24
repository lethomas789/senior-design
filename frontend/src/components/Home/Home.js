import React, { Component } from 'react';
import './Home.css';
import Grid from '@material-ui/core/Grid';
import { Slide } from 'react-slideshow-image';
import image1 from '../../images/dog1.jpg';
import image2 from '../../images/dog2.jpg';
import image3 from '../../images/dog3.jpg';

const properties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: true
}

export default class Home extends Component {
  render() {
    const slideImages = [
      image1,
      image2,
      image3
    ];
     
    return (
      <div id = "homeContainer">
        <Grid container direction="column" justify="center"alignContent = "center" alignItems="center">
          <h1> Welcome to ECS193 ECommerce! </h1>
          <p>This is a ecommerce website for UC Davis's clubs. 
          Here we make merchandise available from all different clubs of Davis.</p>
          <Slide {...properties}>
            <div className="each-slide">
              <div className = "image-container">
                <img src = {slideImages[0]}/>
              </div>
            </div>
            <div className="each-slide">
              <div className = "image-container">
                <img src = {slideImages[1]}/>
              </div>
            </div>
            <div className="each-slide">
              <div className = "image-container">
                <img src = {slideImages[2]}/>
              </div>
            </div>
          </Slide>
        </Grid>
      </div>
    );
  }
}

 
