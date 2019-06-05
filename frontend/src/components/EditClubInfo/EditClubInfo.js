import React, { Component } from "react";
import "./EditClubInfo.css";
import axios from "axios";
import { connect } from "react-redux";
// import actions from "../../store/actions";
import TextField from "@material-ui/core/TextField";
// import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";

class EditClubInfo extends Component {
  state = {
    bio: "",
    lastUpdate: "",
    lastUpdateUser: "",
    vendorName: "",
    emailSchedule: "",
    email: "",
    pickupInfo: "",
    facebook: "",
    instagram: "",
    images: [],
    imageNames: [],
    productID: "",
    picture0: "",
    picture1: ""
  };

  //get club info
  getClubInfo = () => {
    const apiURL = "/api/adminVendor";
    axios
      .get(apiURL, {
        withCredentials: true,
        params: {
          vid: this.props.vendorID
        }
      })
      .then(res => {
        if (res.data.success === true) {
          this.setState({
            bio: res.data.bio,
            lastUpdate: res.data.lastUpdate,
            lastUpdateUser: res.data.lastUpdateUser,
            vendorName: res.data.vendorName,
            pickupInfo: res.data.pickupInfo,
            email: res.data.email,
            facebook: res.data.facebook,
            instagram: res.data.instagram
          });
        } else {
          this.props.notifier({
            title: "Error",
            message: "Must be logged in and an admin to view.",
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
  };

  //detects when an image is uploaded from user
  //change number of files to upload
  handleFileChange = event => {
    //extract file from upload component
    const {
      target: { files }
    } = event;

    // 5 mb
    const maxImageSize = 3000000;

    //TO DO modify file size
    //check if image being uploaded exceeds max file size
    if (files[0].size > maxImageSize) {
      this.props.notifier({
        title: "Error",
        message: "Please upload image less than 3MB",
        type: "danger"
      });

      //if file exceeds file size, cancel upload and set file input to null
      //this is as if no file was uploaded
      event.target.value = null;
      return;
    }

    //if file size is acceptable, proceed saving file in array of images to upload to server

    //store image names
    // const filesToStore = [];
    const filesToStore = this.state.imageNames;

    //store actual image files
    const actualImages = this.state.images;
    // console.log(files[0]);

    //store image name as an object
    let imageName = {};
    imageName.name = files[0].name;

    //push values to arrays
    filesToStore.push(imageName);
    actualImages.push(files[0]);

    //set state of component
    this.setState({
      images: actualImages,
      imageNames: filesToStore
    });
  };

  //upload images to database
  uploadFiles = () => {
    //for each file in images array, upload to database
    const files = this.state.images;
    files.forEach(file => {
      this.fileUploader.startUpload(file);
    });
  };

  // num may be 0 or 1 for pic0 or pic 1
  editPictures = num => {
    const apiURL = `/api/adminVendor/editClubPictures${num}`;
    // console.log("NUM IS:", num);
    // console.log("PICTURE IS:", this.state[`picture${num}`].name);

    axios
      .patch(apiURL, {
        withCredentials: true,
        params: {
          picture: this.state[`picture${num}`].name,
          vid: this.props.vendorID,
          num: num
        }
      })
      .then(res => {
        if (res.data.success) {
          this.props.notifier({
            title: "Success",
            message: res.data.message,
            type: "success"
          });
          let file = this.state[`picture${num}`];
          this.fileUploader.startUpload(file);
        } else {
          this.props.notifier({
            title: "Error",
            message: res.data.message,
            type: "warning"
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.props.notifier({
          title: "Error",
          message: "An error occurred. Please try again.",
          type: "warning"
        });
      });
  };

  handlePictureChange0 = event => {
    const {
      target: { files }
    } = event;

    this.setState({ picture0: files[0] });
  };

  handlePictureChange1 = event => {
    const {
      target: { files }
    } = event;

    this.setState({ picture1: files[0] });
  };

  //handle select when user chooses email preference
  handleSelect = () => {
    //update email preference
    this.setState({
      emailSchedule: this.selectedPreference.value
    });
  };

  //when component loads, get club info from server
  componentDidMount() {
    this.getClubInfo();
  }

  //if user selects another admin to update, update component with new club data
  componentDidUpdate(prevProps) {
    if (prevProps.vendorID != this.props.vendorID) {
      this.getClubInfo();
    }
  }

  //update email preferences
  updateEmailPreferences = () => {
    //validator to make sure admin selected appropriate email schedule
    if (
      this.state.emailSchedule === "" ||
      this.state.emailSchedule === "select"
    ) {
      this.props.notifier({
        title: "Error",
        message: "Please select an email preference time.",
        type: "danger"
      });
      return;
    }
    const apiURL = "/api/adminVendor/emailSchedule";
    axios
      .patch(apiURL, {
        withCredentials: true,
        params: {
          emailSchedule: this.state.emailSchedule,
          vid: this.props.vendorID
        }
      })
      .then(res => {
        if (res.data.success === true) {
          this.props.notifier({
            title: "Success",
            message: res.data.message.toString(),
            type: "success"
          });
        } else {
          this.props.notifier({
            title: "Error",
            message: res.data.message.toString(),
            type: "warning"
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
  };

  //update club info on server
  sendEdit = () => {
    //validator for inputs

    //check a club name was provided
    if (this.state.vendorName === "") {
      this.props.notifier({
        title: "Error",
        message: "Please insert club name",
        type: "danger"
      });
      return;
    }

    //check a bio was provided
    if (this.state.bio === "") {
      this.props.notifier({
        title: "Error",
        message: "Please insert club biography",
        type: "danger"
      });
      return;
    }

    //check if an email was provided
    if (this.state.email === "") {
      this.props.notifier({
        title: "Error",
        message: "Please insert contact email",
        type: "danger"
      });
      return;
    }

    //check if pickup info was provided
    if (this.state.pickupInfo === "") {
      this.props.notifier({
        title: "Error",
        message: "Please insert pickup information",
        type: "danger"
      });
      return;
    }

    const apiURL = "/api/adminVendor/editVendorInfo";
    axios
      .patch(apiURL, {
        withCredentials: true,
        params: {
          vid: this.props.vendorID,
          vendorName: this.state.vendorName,
          bio: this.state.bio,
          email: this.state.email,
          pickupInfo: this.state.pickupInfo,
          facebook: this.state.facebook,
          instagram: this.state.instagram
        }
      })
      .then(res => {
        //if edit was successful, get new info for edited club
        if (res.data.success === true) {
          this.props.notifier({
            title: "Success",
            message: res.data.message.toString(),
            type: "success"
          });
          // this.getClubInfo();j
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
  };

  render() {
    return (
      <div id="edit-club-info-container">
        <h1> Edit Club Info </h1>

        <h6> Last Updated: {this.state.lastUpdate} </h6>
        <h6 id="goDown"> Last Edited By: {this.state.lastUpdateUser} </h6>

        <form id="editClubForm">
          <div className="tooltip">
            <span className="tooltiptext">Your club's name.</span>
            <div className="textForm" id="row">
              <TextField
                label="Club Name"
                value={this.state.vendorName}
                required={true}
                onChange={event =>
                  this.setState({ vendorName: event.target.value })
                }
                style={{ paddingBottom: "20px", width: "35vw" }}
              />
            </div>
          </div>

          <div className="tooltip">
            <span className="tooltiptext">
              Your biography will displayed on your club's about page.
            </span>
            <div className="textForm" id="row">
              <TextField
                label="Biography"
                value={this.state.bio}
                required={true}
                onChange={event => this.setState({ bio: event.target.value })}
                multiline={true}
                rowsMax={Infinity}
                style={{ paddingBottom: "20px", width: "35vw" }}
              />
            </div>
          </div>
          <div className="tooltip">
            <span className="tooltiptext">
              The location and time to pickup your products. This information
              will also be displayed on your club's about page, as well as in
              any of your club's order emails.
            </span>
            <div className="textForm" id="row">
              <TextField
                label="Item Pickup Info"
                value={this.state.pickupInfo}
                required={true}
                onChange={event =>
                  this.setState({ pickupInfo: event.target.value })
                }
                multiline={true}
                style={{ paddingBottom: "20px", width: "35vw" }}
                rowsMax={Infinity}
              />
            </div>
          </div>

          <div className="tooltip">
            <span className="tooltiptext">Link to your facebook.</span>
            <div className="textForm" id="row">
              <TextField
                label="Facebook Link"
                value={this.state.facebook}
                required={true}
                onChange={event =>
                  this.setState({ facebook: event.target.value })
                }
                multiline={false}
                style={{ paddingBottom: "20px", width: "35vw" }}
                rowsMax={Infinity}
              />
            </div>
          </div>

          <div className="tooltip">
            <span className="tooltiptext">Link to your Instagram. </span>
            <div className="textForm" id="row">
              <TextField
                label="Instagram Link"
                value={this.state.instagram}
                required={false}
                onChange={event =>
                  this.setState({ instagram: event.target.value })
                }
                multiline={true}
                style={{ paddingBottom: "20px", width: "35vw" }}
                rowsMax={Infinity}
              />
            </div>
          </div>

          <div className="tooltip">
            <span className="tooltiptext">
              Contact email displayed in your club's about page. Also, this
              email will be contacted periodically about the number of new
              orders, if any.
            </span>
            <div className="textForm" id="row">
              <TextField
                label="Contact Email"
                required={true}
                type="email"
                value={this.state.email}
                onChange={event => this.setState({ email: event.target.value })}
                style={{ paddingBottom: "20px", width: "35vw" }}
              />
            </div>
          </div>
        </form>

        <div className="tooltip">
          {/* <span className="tooltiptext">In progress </span> */}
          <div className="btn-update-info">
            <Button
              variant="contained"
              onClick={this.sendEdit}
              style={{
                backgroundColor: "#DAAA00",
                color: "white",
                fontFamily: "Proxima Nova",
                boxShadow: "none"
              }}
            >
              Update Club Info
            </Button>
          </div>
        </div>

        <div className="club-bio-picture-uploader">
          <h4>Upload club pictures to display on your club's about page.</h4>

          <div id="column" className="file-uploader">
            <div className="file-uploader-tooltip">
              <span className="file-uploader-tooltiptext">
                The first picture will be the main image displayed on your
                club's about page.
              </span>
              <FileUploader
                accept="image/*"
                onChange={this.handlePictureChange0}
                storageRef={firebase
                  .storage()
                  .ref("/images" + "/" + this.props.vendorID + "/")}
                ref={instance => {
                  this.fileUploader = instance;
                }}
                multiple
                onUploadError={error => {
                  this.props.notifier({
                    title: "Error",
                    message: error.toString(),
                    type: "danger"
                  });
                }}
              />
            </div>
          </div>

          <div id="editClubForm">

          <div className="tooltip">
            {/* <span className="tooltiptext">In progress </span> */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.editPictures(0)}
              style={{
                backgroundColor: "#DAAA00",
                color: "white",
                fontFamily: "Proxima Nova",
                boxShadow: "none"
              }}
            >
              Update picture 1
            </Button>
          </div>

          <div id="column" className="file-uploader">
            <div className="file-uploader-tooltip">
              <span className="file-uploader-tooltiptext">
                The second picture will be the image displayed alongside the
                list of other clubs on our website. See
                https://193ecommerce.com/clubs
              </span>
              <FileUploader
                accept="image/*"
                onChange={this.handlePictureChange1}
                storageRef={firebase
                  .storage()
                  .ref("/images" + "/" + this.props.vendorID + "/")}
                ref={instance => {
                  this.fileUploader = instance;
                }}
                multiple
                onUploadError={error => {
                  this.props.notifier({
                    title: "Error",
                    message: error.toString(),
                    type: "danger"
                  });
                }}
              />
            </div>
          </div>

          <div className="tooltip">
            {/* <span className="tooltiptext">In progress </span> */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.editPictures(1)}
              style={{
                backgroundColor: "#DAAA00",
                color: "white",
                fontFamily: "Proxima Nova",
                boxShadow: "none"
              }}
            >
              Update picture 2
            </Button>
          </div>
        </div>
          </div>

        <div id="updateEmailsContainer">
          <div className="update-email-tooltip">
            <span className="update-email-tooltiptext">
              Your club's contact email will be notified every X hours about the
              number of any new incoming orders. If there are no new orders
              within the selected time period, no email will be sent.
            </span>
            <select
              id="emailSelect"
              onChange={this.handleSelect}
              ref={select => {
                this.selectedPreference = select;
              }}
            >
              <option value="select"> Select your email preference </option>
              <option value="none"> None </option>
              <option value="0 */1 * * *"> Every 1 Hour </option>
              <option value="0 */2 * * *"> Every 2 Hours </option>
              <option value="0 */4 * * *"> Every 4 Hours </option>
              <option value="0 */8 * * *"> Every 8 Hours</option>
              <option value="0 */24 * * *"> Every 24 Hours </option>
            </select>
          </div>
          <div className="tooltip">
            {/* <span className="tooltiptext">In progress </span> */}
            <Button
              variant="contained"
              color="primary"
              onClick={this.updateEmailPreferences}
              style={{
                backgroundColor: "#DAAA00",
                color: "white",
                fontFamily: "Proxima Nova",
                boxShadow: "none"
              }}
            >
              Update Email Preferences
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

//obtain state from store as props for component
//get cart items, login value, and user email
const mapStateToProps = state => {
  return {
    items: state.cart.items,
    login: state.auth.login,
    vendorID: state.auth.vendorID,
    isAdmin: state.auth.isAdmin
  };
};

export default connect(
  mapStateToProps,
  null
)(EditClubInfo);
