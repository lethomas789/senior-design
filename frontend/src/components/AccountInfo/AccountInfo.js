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
      email: '',
      firstName: '',
      lastName: '',
      orders: 0,
    }
  }
  //grab user info for account (email, name, and number of orders)
  componentDidMount(){
    const apiURL = '/api/users';
    axios.get(apiURL, {
      withCredentials: true
    })
    .then(res => {
      if(res.data.data.name){
        this.setState({
          email:res.data.data.email,
          firstName: res.data.data.name.firstName,
          lastName:  res.data.data.name.lastName
        })
      }

      //get total number of orders
      axios.get('/api/orders/getUserOrders', {
        withCredentials: true
      })
      .then(res => {
        if(res.data.success === true){
          this.setState({
            orders: res.data.orders.length
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
        <h1> Account Info Here </h1>
        <h1> Email: {this.state.email} </h1>
        <h1> First Name:  {this.state.firstName} </h1>
        <h1> Last Name:  {this.state.lastName} </h1>
        <h1> Orders: {this.state.orders} </h1>
        <h1> Other Info </h1>
        </Paper>
        </div>
      </div>
    )
  }
}

export default AccountInfo;
