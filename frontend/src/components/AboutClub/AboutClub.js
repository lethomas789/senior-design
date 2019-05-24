import React, { Component } from "react";
import PropTypes from "prop-types";
import "./AboutClub.css";
import axios from "axios";
import { Link } from "react-router-dom";
// import Slider from "react-slick";
import testPicture from "../../images/wics2.png";
// import Hidden from "@material-ui/core/Hidden";

class ClubInfo extends Component {
  static propTypes = {
    vendorName: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    bioPictures: PropTypes.array.isRequired
  };

  render() {
    const { vendorName, bio, bioPictures, pickupInfo, email } = this.props;
    return (
      <div>
        <div id="about-club-container">
          <h1 className="club-header">{vendorName}</h1>
          {/* <div className="club-bio">{bio}</div> */}

          <ClubImages bioPictures={bioPictures} />
          <Link
            to="https://www.facebook.com/DavisWICS/"
            style={{ textDecoration: "none", color: "#C26E60" }}
          >
            <div className="events-now">
              <h2>Events Every Thursday!</h2>
            </div>
          </Link>

          <div className="club-bio">
            {bio}
            {/* Women in Computer Science (WiCS) is a community in Davis that
            motivates and prepares women for real life challenges in the field
            of computer science. Women in Computer Science(WiCS) supports,
            empowers and motivates the growing community of women in computer
            science. We aim to prepare women for tech industry, in addition to
            inspiring women to explore educational and professional
            opportunities in computing through creating a powerful community,
            providing mentorship and helping them to succeed. We aim to grow,
            learn and spread the joy of computer science together! Our mission
            is to create a platform where we can share ideas about our personal
            projects, promote interest in programming and go to Hackathons. We
            want to create a community of girls helping each other learn to code
            and working together to solve problems. */}
          </div>
          <div className="small-width">
            <div className="roww">
              <div className="colls">
                <Link to="https://www.facebook.com/DavisWICS/">
                  <img
                    src={require("../../images/facebook.svg")}
                    alt="Facebook"
                    width="100%"
                  />
                </Link>
              </div>

              <div className="colls">
                <Link to="https://www.instagram.com/wicsdavis/">
                  <img
                    src={require("../../images/instagram.svg")}
                    alt="Instagram"
                    width="100%"
                  />
                </Link>
              </div>

              <div className="colls">
                <Link to="/shop">
                  <img
                    src={require("../../images/creative-market.svg")}
                    alt="Shop"
                    width="100%"
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
          const { vendorName, bio, bioPictures, pickupInfo, email } = res.data;
          this.setState({
            vendorName,
            bio,
            bioPictures,
            pickupInfo,
            email
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
    const { vendorName, bio, bioPictures, pickupInfo, email } = this.state;

    return (
      // <div id="about-club-container">
      <ClubInfo
        vendorName={vendorName}
        bio={bio}
        bioPictures={bioPictures}
        pickupInfo={pickupInfo}
        email={email}
      />
      // </div>
    );
  }
}
