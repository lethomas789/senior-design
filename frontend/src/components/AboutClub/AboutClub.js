import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "./AboutClub.css";
import axios from "axios";
import Slider from "react-slick";
import testPicture from "../../images/wics2.png";

class ClubInfo extends Component {
  static propTypes = {
    vendorName: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    bioPictures: PropTypes.array.isRequired
  };

  render() {
    const { vendorName, bio, bioPictures } = this.props;
    return (
        <div id="about-club-container">
          <h1 className="club-header">{vendorName}</h1>
          {/* <div className="club-bio">{bio}</div> */}
          <ClubImages bioPictures={bioPictures} />

          <div className="club-bio">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
            modi rem quisquam non ullam voluptate, incidunt natus quibusdam odit
            quasi voluptas nobis soluta, aspernatur, pariatur aliquid similique
            alias libero quia!
          </div>
          {/* <div className="club-links">LINKS BOX</div> */}

          <div className="club-links">
            <div className="hero-texttt">Events every week!</div>
          </div>
          {/* <div className="club-meetings">CLUB MEETINGS/PICKUP INFO BOX</div> */}

          <div className="club-meetings">
            <div className="hero-texttt">Shop our merch!</div>
          </div>
        </div>
    );
  }
}

class ClubImages extends Component {
  static propTypes = {
    bioPictures: PropTypes.array.isRequired
  };

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
      pauseOnHover: true
    };
    return (
      <div className="club-pictures-container">
        <img src={testPicture} alt="About Club" />
        {/* <Slider {...settings } className="club-pictures-slider">
          {bioPictures.map(img => 
            <img src={img} alt="Img" key={img} className="club-picture"/>
          )}
        </Slider> */}
      </div>
    );
  }
}

export default class AboutClub extends Component {
  /*
  static propTypes = {
    vid: PropTypes.string
  };
  */

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
          this.props.notifier({
            title: "Error",
            message: res.data.message,
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

  // TODO style about us page
  render() {
    const { vendorName, bio, bioPictures } = this.state;

    return (
      // <div id="about-club-container">
      <ClubInfo vendorName={vendorName} bio={bio} bioPictures={bioPictures} />
      // </div>
    );
  }
}
