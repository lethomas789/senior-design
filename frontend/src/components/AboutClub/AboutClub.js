import React, { Component } from "react";
import PropTypes from "prop-types";
import "./AboutClub.css";
import axios from "axios";
import { Link } from "react-router-dom";
// import Slider from "react-slick";
// import testPicture from "../../images/wics2.png";
// import Hidden from "@material-ui/core/Hidden";

class ClubInfo extends Component {
  static propTypes = {
    vendorName: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    bioPictures: PropTypes.array.isRequired
  };

  render() {
    let {
      vendorName,
      bio,
      bioPictures,
      pickupInfo,
      email,
      facebook,
      instagram,
      vid
    } = this.props;

    console.log('FACEBOOK IS:', facebook);

    if (facebook == undefined) {
      facebook = "none";
    }
    if (instagram == undefined) {
      instagram = "none";
    }

    return (
      <div>
        <div id="about-club-container">
          <h1 className="club-header">{vendorName}</h1>
          {/* <div className="club-bio">{bio}</div> */}

          <ClubImages bioPictures={bioPictures} />
          <a
            href={facebook}
            style={{ textDecoration: "none", color: "#C26E60" }}
          >
            <div className="events-now">
              <h2>Events Every Thursday!</h2>
            </div>
          </a>

          <div className="club-bio">
            {bio}
          </div>

          <div className="small-width ">
            <div className="roww">
            {/* <div className="club-media-links"> */}

              {facebook != "" ? (
                <div className="colls">
                {/* <div> */}
                  <a href={facebook}>
                    <img
                      src={require("../../images/facebook.svg")}
                      alt="Facebook"
                      width="100%"
                    />
                  </a>
                </div>
              ) : (
                ""
              )}

              {instagram != "" ? (
                <div className="colls">
                {/* <div> */}
                  <a href={instagram}>
                    <img
                      src={require("../../images/instagram.svg")}
                      alt="Instagram"
                      width="100%"
                    />
                  </a>
                </div>
              ) : (
                ""
              )}

              <div className="colls">
                {/* <div> */}
                <Link to={`/vendorProducts/${vid}`}>
                  <img
                    src={require("../../images/creative-market.svg")}
                    alt="Shop"
                    width="100%"
                    height="100%"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* <p className="club-pick-up">Pick-up Locations: Kemper Hall Lobby</p> */}
          <p className="club-pick-up">{pickupInfo}</p>

          <p className="club-contacts">Contact us: {email} </p>
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
        <img src={bioPictures[0]} alt="About Club" />
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
    bioPictures: [],
    pickupInfo: "",
    email: "",
    facebook: "",
    instagram: ""
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
          const {
            vendorName,
            bio,
            bioPictures,
            pickupInfo,
            email,
            facebook,
            instagram
          } = res.data;

          this.setState({
            vendorName,
            bio,
            bioPictures,
            pickupInfo,
            email,
            facebook,
            instagram
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
    const vid = this.props.match.params.vid;

    const {
      vendorName,
      bio,
      bioPictures,
      pickupInfo,
      email,
      facebook,
      instagram
    } = this.state;

    return (
      // <div id="about-club-container">
      <ClubInfo
        vendorName={vendorName}
        bio={bio}
        bioPictures={bioPictures}
        pickupInfo={pickupInfo}
        email={email}
        facebook={facebook}
        instagram={instagram}
        vid={vid}
      />
    );
  }
}
