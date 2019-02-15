import React, { Component } from 'react';
import './Home.css';
import Grid from '@material-ui/core/Grid';
import { Slide } from 'react-slideshow-image';


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
      '/../images/dog1.jpg',
      '/..images/dog2.jpg',
      '/..images/dog3.jpg'
    ];
     
    return (
      <div id = "homeContainer">
        <Grid container direction="column" justify="center"alignContent = "center" alignItems="center">
          <h1> Welcome to ECS193 ECommerce! </h1>
          <p>This is a ecommerce website for UC Davis's clubs. 
          Here we make merchandise available from all different clubs of Davis.</p>
          <Slide {...properties}>
        <div className="each-slide">
          <div style={{'backgroundImage': `url(${slideImages[0]})`}}>
            <span>Slide 1</span>
          </div>
        </div>
        <div className="each-slide">
          <div style={{'backgroundImage': `url(${slideImages[1]})`}}>
            <span>Slide 2</span>
          </div>
        </div>
        <div className="each-slide">
          <div style={{'backgroundImage': `url(${slideImages[2]})`}}>
            <span>Slide 3</span>
          </div>
        </div>
      </Slide>
        </Grid>
      </div>
    );
  }
}

 