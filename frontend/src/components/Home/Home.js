import React, { Component } from "react";
import "./Home.css";
import Grid from "@material-ui/core/Grid";
import { Slide } from "react-slideshow-image";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import image1 from "../../images/muclubs.jpg";
import image2 from "../../images/foodtruck.jpg";
import image3 from "../../images/horses.jpg";

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
          <header>
            <h1> Welcome to ECS193 E-Commerce! </h1>
            </header>
          </div>

          <div id="carouselContainer">
            <AliceCarousel
              autoPlay={true}
              autoPlayInterval={3000}
              buttonsDisabled={true}
              // responsive={this.responsive}
              style={{ height: "100vh" }}
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
            <div className="colls">
              <div className="moreContainer">
                <img src={require("../../images/cows.jpg")} width="100%" />
                {/* <a target="_blank" href="https://193ecommerce.com/shop">
                    <img src={require("../../images/cows.jpg")} width="100%" />
                  </a> */}
                <div className="hero-textt">SHOP</div>
                {/* <a target="_blank" href="https://193ecommerce.com/shop">
                  <div className="hero-textt">SHOP</div>
                </a> */}
              </div>
            </div>

            <div className="colls">
              <div className="moreContainer">
                <img src={require("../../images/band.jpg")} width="100%" />
                <div className="hero-textt">CLUBS</div>
              </div>
            </div>

            <div className="colls">
              <div className="moreContainer">
                <img src={require("../../images/bikes.jpg")} width="100%" />
                <div className="hero-textt">ABOUT</div>
              </div>
            </div>
          </div>
        </Grid>
      </div>
    );
  }
}
