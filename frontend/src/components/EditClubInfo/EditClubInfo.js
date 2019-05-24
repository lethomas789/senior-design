import React, { Component } from "react";
import "./EditClubInfo.css";
import axios from "axios";
import { connect } from "react-redux";
// import actions from "../../store/actions";
import TextField from "@material-ui/core/TextField";
// import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

class EditClubInfo extends Component {
  state = {
    bio: "",
    lastUpdate: "",
    lastUpdateUser: "",
    vendorName: "",
    emailSchedule: "",
    email: "",
    pickupInfo: "",
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

  //update email preferences
  updateEmailPreferences = () => {
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
          this.getClubInfo();
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
	<div className = "tooltip"> <span className="tooltiptext">In progress </span>
        <div className = "textForm" id = "row">
          <TextField
            value={this.state.vendorName}
            onChange={event =>
              this.setState({ vendorName: event.target.value })
            }
            style={{ paddingBottom: "20px", width: "35vw"}}
          />
          </div>
        </div>

	  <div className = "tooltip"> <span className="tooltiptext">In progress </span>
          <div className = "textForm" id = "row">
          <TextField
            label="Biography"
            value={this.state.bio}

            onChange={event => this.setState({ bio: event.target.value })}
            multiline={true}
            
            rowsMax={Infinity}

            style={{ paddingBottom: "20px", width: "35vw" }}
          />
          </div>
          </div>
        <div className = "tooltip"> <span className="tooltiptext">In progress </span>
        <div className = "textForm" id = "row">
          <TextField
            label="Item Pickup Info"
            value={this.state.pickupInfo}

            onChange={event => this.setState({ pickupInfo: event.target.value })}
            multiline={true}
            style={{ paddingBottom: "20px", width: "35vw"}}
            
            rowsMax={Infinity}
          />
          </div>
	</div>

          <div className = "tooltip"> <span className="tooltiptext">In progress </span>
          <div className = "textForm" id = "row">
          <TextField
            label="Contact Email"
            type="email"
            value={this.state.email}
            onChange={event =>
              this.setState({ email: event.target.value })
            }
            style={{ paddingBottom: "20px", width: "35vw" }}
          />
          </div>
	  </div>

        </form>

        <div className = "tooltip"> <span className="tooltiptext">In progress </span>
        <div className="btn-update-info">
          <Button variant="contained" 
          onClick={this.sendEdit}
          style = {{backgroundColor:"#DAAA00",
                  color: "white", 
                  fontFamily: "Proxima Nova", 
                  boxShadow: "none"}}>
            Update Club Info
          </Button>
        </div>
        </div>
        <div id="updateEmailsContainer">
	  <div className = "tooltip"> <span className="tooltiptext">Your club's contact email will be notified every X hours about the number of any new incoming orders. </span>
          <select
            id="emailSelect"
            onChange={this.handleSelect}
            ref={select => {
              this.selectedPreference = select;
            }}
          >
            <option value="select"> Select your email preference </option>
            <option value="0 */1 * * *"> Every 1 Hour </option>
            <option value="0 */2 * * *"> Every 2 Hours </option>
            <option value="0 */4 * * *"> Every 4 Hours </option>
            <option value="0 */8 * * *"> Every 8 Hours</option>
            <option value="0 */24 * * *"> Every 24 Hours </option>
          </select>
	  </div>
	  <div className = "tooltip"> <span className="tooltiptext">In progress </span>
          <Button
            variant="contained"
            color="primary"
            onClick={this.updateEmailPreferences}
            style = {{backgroundColor:"#DAAA00",
                  color: "white", 
                  fontFamily: "Proxima Nova", 
                  boxShadow: "none"}}
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
    isAdmin: state.auth.isAdmin,
  };
};

export default connect(
  mapStateToProps,
  null
)(EditClubInfo);
