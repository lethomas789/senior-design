import React, { Component } from 'react'
import PropTypes from 'prop-types'
import "./AboutClub.css";
import axios from "axios";

class ClubInfo extends Component {
  static propTypes = {
    vendorName: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
  }

  render() {
    const { vendorName, bio } = this.props;
    return (
      <div id="about-club-info-container">
        <div className="club-header">
          <b>{vendorName}</b>
        </div>
        <div className="club-info">
          {bio}
        </div>
        <div className="club-links">
          TODO
        </div>
      </div>
    )
  }
}

export default class AboutClub extends Component {
  static propTypes = {
    vid: PropTypes.string.isRequired,
  }

  state = {
    vendorName: '',
    bio: '',
    // bioImages ?
    // TODO more stuff
    // TODO also change backend
  }

  componentDidMount() {
    //extract param values from URL
    //match object contains parameter values
    const handle = this.props.match.params;
    const route = `/api/getVendorInfo/aboutClub`;

    axios.get(route, {
      // params: { vid: this.props.vid }

      //extract vid from URL
      params: { vid: handle.vid }
    })
      .then(res => {
        if (res.data.success) {
          const { vendorName, bio } = res.data;
          this.setState({
            vendorName,
            bio,
          });
        }
        else {
          alert(res.data.message);
        }
      })
      .catch(err => {
        alert(err);
      });
  }
  
  // TODO style about us page
  render() {
    const { vendorName, bio } = this.state;

    return (
      <div id="about-club-container">
        <img src="#" alt="Club Img"/>

        <ClubInfo 
          vendorName={vendorName}
          bio={bio}
        />

      </div>
    )
  }
}
