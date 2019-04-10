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

          <img src={require('../../images/wics2.png')} width="100%" />
          <div className = "homeText">
          <div className = "center">
          <p>This is a ecommerce website for UC Davis's clubs. 
          Here we make merchandise available from all different clubs of Davis.
          UC Davis clubs typically have an unofficial way to sell their merchandise, usually through Facebook and word of mouth. 
          There is no easy way to display, buy and sell goods. 
          Our site is to provide a method to streamline this process. 
          Clubs can post their items onto our site, customers purchase what they like, and the appropriate profits will go towards the participating clubs. 
          Those interested in becoming vendors can apply on our site also.
          </p>
          </div>
          </div>
          <div className = "roww">
          <div className="colls">
          <div className = "moreContainer">
          <div className = "hero-imagee">
          <a target="_blank" href="https://193ecommerce.com/shop">
          <img src={require('../../images/cows.jpg')} width="100%"/>
          </a>
          </div>
          <a target="_blank" href="https://193ecommerce.com/shop">
          <div className = "hero-textt">SHOP</div>
          </a>
          </div>
          </div>


          <div className="colls">
          <div className = "moreContainer">
          <div className = "hero-imagee">
          <img src={require('../../images/band.jpg')} width="100%" />
          </div>
          <div className = "hero-textt">CLUBS</div>
          </div>
          </div>
          
          <div className="colls">
          <div className = "moreContainer">
          <div className = "hero-imagee">
          <a target="_blank" href="https://193ecommerce.com/about">
          <img src={require('../../images/bikes.jpg')} width="100%"/>
          </a>
          </div>
          <a target="_blank" href="https://193ecommerce.com/about">
          <div className = "hero-textt">ABOUT</div>
          </a>
          </div>
          </div>

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

 
