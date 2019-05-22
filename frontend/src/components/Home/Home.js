import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Grid from "@material-ui/core/Grid";
import { Slide } from "react-slideshow-image";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import image1 from "../../images/muclubs.jpg";
import image2 from "../../images/foodtruck.jpg";
import image3 from "../../images/horses.jpg";
import Hidden from "@material-ui/core/Hidden";

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
          {/* <div className="helv"> */}
          <header>
            <h1 className = "helv"> Welcome to ECS193 E-Commerce! </h1>
            </header>
          {/* </div> */}

          <div id="carouselContainer">
            <AliceCarousel
              autoPlay={true}
              autoPlayInterval={3000}
              buttonsDisabled={true}
              // responsive={this.responsive}
              style={{ height: "100vh" }}
            > 
            {/* must disable the carousel, cannot override library's responsive design */}
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
              <Link to="/shop">
                <div className="moreContainer">
                  <img src={require("../../images/cows.jpg")} alt="Collection of Toy Cows" width="100%" />
                  <div className="hero-textt">SHOP</div>
                </div>
              </Link>
            </div>

            <div className="colls">
              <Link to="/clubs">
                <div className="moreContainer">
                  <img src={require("../../images/band.jpg")} alt="UC Davis Band" width="100%" />
                  <div className="hero-textt">CLUBS</div>
                </div>
              </Link>
            </div>

            <div className="colls">
              <Link to="/about">
                <div className="moreContainer">
                  <img src={require("../../images/bikes.jpg")} alt="Bike Lane" width="100%" />
                  <div className="hero-textt">ABOUT</div>
                </div>
              </Link>
            </div>
          </div>
        </Grid>
      </div>
    );
  }
}
