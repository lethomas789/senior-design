import React, { Component } from 'react';
import './EditClubInfo.css';
import axios from 'axios';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

class EditClubInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      bio: '',
      lastUpdate: '',
      lastUpdateUser: '',
      vendorName: '',
      emailSchedule: '',
    };

    this.getClubInfo = this.getClubInfo.bind(this);
    this.sendEdit = this.sendEdit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.updateEmailPreferences = this.updateEmailPreferences.bind(this);
  }

  //get club info
  getClubInfo(){
    const apiURL = "/api/adminVendor";
    axios.get(apiURL, {
      params:{
        user: this.props.user,
        vid: this.props.vendorID
      }
    })
    .then(res => {
      if(res.data.success === true){
        this.setState({
          bio: res.data.bio,
          lastUpdate: res.data.lastUpdate,
          lastUpdateUser: res.data.lastUpdateUser,
          vendorName: res.data.vendorName
        })
      }
      else{
        alert("Error getting club info");
      }
    })
    .catch(err => {
      alert(err);
    })
  }

  //handle select when user chooses email preference
  handleSelect(){
    //update email preference
    this.setState({
      emailSchedule: this.selectedPreference.value
    });
  }

  //when component loads, get club info from server
  componentDidMount(){
    this.getClubInfo();
  }

  //update email preferences
  updateEmailPreferences(){
    const apiURL = '/api/adminVendor/emailSchedule';
    axios.patch(apiURL, {
      params:{
        user: this.props.user,
        emailSchedule: this.state.emailSchedule,
        vid: this.props.vendorID
      }
    })
    .then(res => {
      if(res.data.success === true){
        alert(res.data.message);
      }
      else{
        alert(res.data.message);
      }
    })
    .catch(err => {
      alert(err);
    })
  }

  //update club info on server
  sendEdit(){
    const apiURL = "/api/adminVendor/editVendorInfo";
    axios.patch(apiURL, {
      params:{
        user: this.props.user,
        vid: this.props.vendorID,
        vendorName: this.state.vendorName,
        bio: this.state.bio
      }
    })
    .then(res => {
      //if edit was successful, get new info for edited club
      if(res.data.success === true){
        alert(res.data.message);
        this.getClubInfo();
      }
    })
    .catch(err => {
      alert(err);
    })
  }

  render() {
    return (
      <div>
        <Grid container direction = "column" justify = "center" alignItems = "center">
          <h1> Edit Club Info </h1>
          <h6> Last Updated: {this.state.lastUpdate} </h6>
          <h6> Last Edited By: {this.state.lastUpdateUser} </h6>

          <form id = "editClubForm">
            <TextField
              className = "inputWidth"
              label="Club Name"
              value={this.state.vendorName}
              onChange={(event) => this.setState({ vendorName: event.target.value })}          
            />

            <TextField
              className = "inputWidth"
              label="Biography"
              value={this.state.bio}
              id = "standard-full-width"
              onChange={(event) => this.setState({ bio: event.target.value })}          
            />

            <Button variant = "contained" color = "primary" onClick = {this.sendEdit}> Update Club  </Button>

            <div id = "updateEmailsContainer">
              <div id = "updateEmails">
                <select id = "emailSelect" onChange = {this.handleSelect} ref = {select => {this.selectedPreference = select}}>
                  <option value = "select"> Select </option>
                  <option value = "0 */1 * * *"> Every 1 Hour </option>
                  <option value = "0 */2 * * *"> Every 2 Hours </option>
                  <option value = "0 */4 * * *"> Every 4 Hours </option>
                  <option value = "0 */8 * * *"> Every 8 Hours</option>
                  <option value = "0 */24 * * *"> Every 24 Hours </option>
                </select>
                <Button variant = "contained" color = "primary" onClick = {this.updateEmailPreferences}> Update Email Preferences </Button>
              </div>
            </div>
          </form>
          
        </Grid>
      </div>
    )
  }
}

//obtain state from store as props for component
//get cart items, login value, and user email
const mapStateToProps = state => {
  return{
    items: state.cart.items,
    login: state.auth.login,
    user: state.auth.user,
    vendorID: state.auth.vendorID
  }
}

export default connect(mapStateToProps, null)(EditClubInfo);
