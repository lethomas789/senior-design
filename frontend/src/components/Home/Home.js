import React, { Component } from 'react';
import './Home.css';
import Grid from '@material-ui/core/Grid';
import { Slide } from 'react-slideshow-image';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import image1 from '../../images/dog1.jpg';
import image2 from '../../images/dog2.jpg';
import image3 from '../../images/dog3.jpg';

export default class Home extends Component {
  render() {
    return (
      <div id = "homeContainer">
        <Grid container direction="column" justify="center"alignContent = "center" alignItems="center">
          <h1> Welcome to ECS193 ECommerce! </h1>
          <div className = "hero-image">
          <img src={require('../../images/wics2.png')} width="100%" />
          </div>
          <p>This is a ecommerce website for UC Davis's clubs. 
          Here we make merchandise available from all different clubs of Davis.
          </p>
          <div className = "bottom-tabs">
          <img src={require('../../images/cows.jpg')} width="100%" />
          </div>
         

          {/* <div id = "carouselContainer">
            <AliceCarousel autoPlay = {true} autoPlayInterval = {2000} buttonsDisabled = {true}>
                <img className = "slideImage" src = {image1} />
                <img className = "slideImage" src = {image2} />
                <img className = "slideImage" src = {image3} />
            </AliceCarousel>
          </div> */}
  
        </Grid>
      </div>
    );
  }
}

 
