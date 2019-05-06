import React, { Component } from 'react';
import './AccountInfo.css';
import { connect } from "react-redux";
import actions from "../../store/actions";
import Paper from "@material-ui/core/Paper";
import axios from 'axios';

class AccountInfo extends Component {

  constructor(props){
    super(props);
    this.state = {
      email: this.props.email,
      firstName: '',
      lastName: ''
    }
  }

  componentDidMount(){
    const apiURL = '/api/users';
    axios.get(apiURL, {
      params:{
        email: this.props.email
      }
    })
    .then(res => {
      if(res.data.data.name){
        this.setState({
          firstName: res.data.data.name.firstName,
          lastName:  res.data.data.name.lastName
        })
      }
    })
    .catch(err => {
      this.props.notifier({
        title: "Error",
        message: err.toString(),
        type: "danger"
      });
    })
  }


  render() {
    return (
      <div className ="account-info-header">
      <div className = "accountForms">
      <Paper className="paper-account-Container">
        <h1> Account Info Here:  </h1>
        <h1> Email: {this.state.email} </h1>
        <h1> First Name:  {this.state.firstName} </h1>
        <h1> Last Name:  {this.state.lastName} </h1>
        <h1> Orders: </h1>
        <h1> Other Info </h1>
        </Paper>
        </div>
      </div>
    )
  }
}

//obtain state from store as props for component
//get cart items, login value, and user email
const mapStateToProps = state => {
  return {
    email: state.auth.user,
  };
};

export default connect(
  mapStateToProps,
  null
)(AccountInfo);
