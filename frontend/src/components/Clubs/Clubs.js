import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Clubs.css";

function DisplayClub(props) {
  const { bio, vendorName, bioPicture, vid } = props;

  return (
    <div>
      <Link to={`/aboutClub/${vid}`} className="moreColls">
        <div className="roww">
          <div className="moreContainer">
            <img
              data-testid={vid}
              src={bioPicture}
              alt={`Club: ${vid}`}
              width="100%"
            />
            <div className="hero-textt">{vendorName}</div>
          </div>
        </div>
      </Link>
      <Link to={`/vendorProducts/${vid}`}> See club's items.</Link>
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

    // const res = await axios.get(route);

    // if (res.data.success) {
    //   this.setState({ vendors: res.data.vendors });
    // } else {
    //   this.props.notifier({
    //     title: "Error",
    //     message: res.data.message.toString(),
    //     type: "danger"
    //   });
    // }

    return axios
      .get(route)
      .then(res => {
        if (res.data.success) {
          this.setState({ vendors: res.data.vendors });
        } else {
          this.props.notifier({
            title: "Error",
            message: res.data.message.toString(),
            type: "danger"
          });
        }
      })
      .catch(err => {
        this.props.notifier({
          title: "Error",
          message: err.toString(),
          type: "danger"
        });
      });
  }

  render() {
    const { vendors } = this.state;
    return (
      <div id="display-clubs-container">
        <h1 className="clubHeader">CLUBS</h1>
        <div id="display-club-boxes">
          {vendors.map(vendor => (
            <DisplayClub
              bio={vendor.bio}
              vendorName={vendor.vendorName}
              bioPicture={vendor.bioPictures[0]}
              vid={vendor.vid}
            />
          ))}
        </div>
      </div>
    );
  }
}
