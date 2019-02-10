import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import './About.css';

export default class Home extends Component {
  render() {
    return (
      <div>
        <Grid container direction="column" justify="center"alignContent = "center" alignItems="center">
          <h1 id = "aboutHeader"> About Us </h1>
        </Grid>
      </div>
    );
  }
}
