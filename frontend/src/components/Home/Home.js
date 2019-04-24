import React, { Component } from "react";
import "./Home.css";
import Grid from "@material-ui/core/Grid";
import { Slide } from "react-slideshow-image";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import image1 from "../../images/muclubs.jpg";
import image2 from "../../images/foodtruck.jpg";
import image3 from "../../images/horses.jpg";

import { Link, Redirect } from "react-router-dom";

export default class Home extends Component {
  render() {
    return (
      <div id="homeContainer">
        <Grid
          container
          direction="column"
          justify="center"
          alignContent="center"
          alignItems="center"
        >
          <div className="helv">
            <h1> Welcome to ECS193 ECommerce! </h1>
          </div>

          {/* <img src={require('../../images/wics2.png')} width="100%" /> */}
          {/* <div className = "homeText">
          <div className = "center">
          <p>This is a ecommerce website for UC Davis's clubs. 
          Here we make merchandise available from all different clubs of Davis.
          UC Davis clubs typically have an unofficial way to sell their merchandise, usually through Facebook and word of mouth. 
          There is no easy way to display, buy and sell goods. 
          </p>
          </div>
          </div> */}

          <div id="carouselContainer">
            <AliceCarousel
              autoPlay={true}
              autoPlayInterval={3000}
              buttonsDisabled={true}
            >
              <img className="slideImage" src={image1} />
              <img className="slideImage" src={image2} />
              <img className="slideImage" src={image3} />
            </AliceCarousel>
          </div>

          <div className="helvv">
            <h2 className="decorated">
              <span>An E-Commerce Website for Clubs at UC Davis</span>
            </h2>
          </div>

          <div className="roww">
            <Link to="/shop">
              <div className="colls">
                <div className="moreContainer">
                  <img
                    src={require("../../images/cows.jpg")}
                    width="100%"
                    alt="Shop"
                  />
                  <div className="hero-textt">SHOP</div>
                </div>
              </div>
            </Link>

            <Link to="/clubs">
              <div className="colls">
                <div className="moreContainer">
                  <img
                    src={require("../../images/band.jpg")}
                    width="100%"
                    alt="Clubs"
                  />
                  <div className="hero-textt">CLUBS</div>
                </div>
              </div>
            </Link>

            <Link to="/about">
              <div className="colls">
                <div className="moreContainer">
                  <img
                    src={require("../../images/bikes.jpg")}
                    width="100%"
                    alt="About"
                  />
                  <div className="hero-textt">ABOUT</div>
                </div>
              </div>
            </Link>
          </div>
        </Grid>
      </div>
    );
  }
}
