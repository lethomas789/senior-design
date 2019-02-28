import React, { Component } from 'react';
import './VendorSignup.css';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

//vendor confirmation

//insert email for verification
//dropdown menu to select clubs
//insert access code

class VendorSignup extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      code: '',
      vendor: 'Select Club Name',
      open: false,
      value: '',
      vendorID: '',
      vendors: []
    };
    this.sendSignup = this.sendSignup.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  //store list of active vendors from database
  componentDidMount(){
    const apiURL = "http://localhost:4000/api/getVendorInfo";
    axios.get(apiURL)
      .then(res => {
        this.setState({
          vendors: res.data.vendors
        })
      })
  }

  //close select
  handleClose(){
    this.setState({
      open: false
    })
  }

  //open select
  handleOpen(){
    this.setState({
      open: true
    })
  }

  //update value selected
  handleSelect(event){
    console.log(event);
    this.setState({
      vendorID: event.target.value    
    })
    //obtain vid by searching list of active vendors and comparing dropdown value
    // for(let i = 0; i < this.state.vendors.length; i++){
    //   if (event.target.value === this.state.vendors[i].vendorName){
    //     this.setState({
    //       vendorID: this.state.vendors[i].vid
    //     })
    //   }
    // }
  }

  //send signup to verify admin process
  sendSignup(){
    const apiURL = "http://localhost:4000/api/adminVendor/addAdminUser";

    axios.post(apiURL, {
      params:{
        user: this.state.email,
        vid: this.state.vendorID,
        adminCode: this.state.code
      }
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      alert(err);
    })
  }

  render() {
    const vendorList = this.state.vendors.map(result => {
      return <MenuItem value = {result.vid} name = {result.vendorName}> {result.vendorName} </MenuItem>
    });

    return (
      <div>
        <Grid container direction = "column" justify = "center" alignItems = "center">
          <Paper id = "signupPaperContainer">
            <h1> Vendor Sign Up </h1>

            <div className = "textForm" id="row">
              <TextField
                label="Email"
                required="true"
                onChange={(event) => this.setState({ email: event.target.value })}
              />
            </div>

            <div className = "textForm" id="row">
              <TextField
                label="Access Code"
                required="true"
                onChange={(event) => this.setState({ code: event.target.value })}
              />
            </div>

            <h5> Select Vendor </h5>
            <div className = "textForm" id = "row">
              <FormControl id = "clubForm">
                <InputLabel> {this.state.vendor} </InputLabel>
                <Select value = {this.state.value} open = {this.state.open} onClose = {this.handleClose} onOpen = {this.handleOpen} onChange = {this.handleSelect}>
                  {vendorList}
                </Select>
              </FormControl>
            </div>

            <Button type = "submit" variant = "contained" color = "primary" onClick = {this.sendSignup}> Sign Up  </Button>
          </Paper>
        </Grid>
      </div>
    )
  }
}

export default VendorSignup;
