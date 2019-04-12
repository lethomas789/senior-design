import React, { Component } from "react";
import PropTypes from "prop-types";
import "./AboutClub.css";
import axios from "axios";
import Slider from 'react-slick';

class ClubInfo extends Component {
  static propTypes = {
    vendorName: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
  };

  render() {
    const { vendorName, bio } = this.props;
    return (
      <div id="club-info-container">
        <div className="club-header">{vendorName}</div>
        <div className="club-info">{bio}</div>
        <div className="club-links">TODO</div>
      </div>
    );
  }
}

class ClubImages extends Component {
  static propTypes = {
    bioPictures: PropTypes.array.isRequired,
  }

  render() {
    const { bioPictures } = this.props;
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      pauseOnHover: true,
    }
    return (
      <div className="club-pictures-container">
        <Slider {...settings } className="club-pictures-slider">
          {bioPictures.map(img => 
            <img src={img} alt="Img" key={img} className="club-picture"/>
          )}
        </Slider>
      </div>
    )
  }
}

export default class AboutClub extends Component {
  static propTypes = {
    vid: PropTypes.string
  };

  state = {
    vendorName: "",
    bio: "",
    bioPictures: []
    // TODO more stuff
    // TODO also change backend
  };

  componentDidMount() {
    //extract param values from URL
    //match object contains parameter values
    const vid = this.props.match.params.vid;

    const route = `/api/getVendorInfo/aboutClub`;

    axios
      .get(route, {
        // params: { vid: this.props.vid }

        //extract vid from URL
        params: { vid: vid }
      })
      .then(res => {
        if (res.data.success) {
          const { vendorName, bio, bioPictures } = res.data;
          this.setState({
            vendorName,
            bio,
            bioPictures
          });
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => {
        alert(err);
      });
  }

  // TODO style about us page
  render() {
    const { vendorName, bio, bioPictures } = this.state;

    return (
      <div id="about-club-container">
        <ClubImages bioPictures={bioPictures} />
        <ClubInfo vendorName={vendorName} bio={bio} bioPictures={bioPictures} />
      </div>
    );
  }
}
