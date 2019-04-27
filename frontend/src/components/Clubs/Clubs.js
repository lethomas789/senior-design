import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./Clubs.css";

function DisplayClub(props) {
  const { bio, vendorName, bioPicture } = props;

  return (
    <div className="moreColls">
    <div className="roww">
    <div className="moreContainer">
   
      <img src={bioPicture} alt="Display Club" width="100%"/>
      <div className ="hero-textt">
      CLUB
      </div>
    </div>
    </div>
    </div>
  );
}

export default class Clubs extends Component {
  state = {
    vendors: []
  };

  // get list of vendors and their info on mount
  componentDidMount() {
    const route = `/api/getVendorInfo`;

    axios
      .get(route)
      .then(res => {
        if (res.data.success) {
          this.setState({ vendors: res.data.vendors });
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  render() {
    const { vendors } = this.state;
    return (
      <div id="display-clubs-container">
        <h1 className = "clubHeader">CLUBS</h1>
        <div id="display-club-boxes">
          {vendors.map(vendor => (
            <DisplayClub
              bio={vendor.bio}
              vendorName={vendor.vendorName}
              bioPicture={vendor.bioPictures[0]}
            />
          ))}
        </div>
      </div>
    );
  }
}
