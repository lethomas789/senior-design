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
      vendor: '',
      open: false,
      value: ''
    };
    this.sendSignup = this.sendSignup.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
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
    this.setState({
      value: event.target.value
    })
  }

  //send signup to verify admin process
  sendSignup(){
    const apiURL = "http://localhost:4000/api/adminVendor/addAdminUser";

    axios.post(apiURL, {
      params:{
        
      }
    })


  }

  render() {
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
                onChange={(event) => this.setState({ password: event.target.value })}
              />
            </div>

            <h5> Select Vendor </h5>
            <div className = "textForm" id = "row">
              <FormControl id = "clubForm">
                <InputLabel> Select Club Name </InputLabel>
                <Select value = {this.state.value} open = {this.state.open} onClose = {this.handleClose} onOpen = {this.handleOpen} onChange = {this.handleSelect}>
                  <MenuItem value = "Vendor1"> Vendor1 </MenuItem>
                  <MenuItem value = "Vendor2"> Vendor2 </MenuItem>
                  <MenuItem value = "Vendor3"> Vendor3 </MenuItem>
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
