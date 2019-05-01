import React, { Component } from 'react';
import './AccountInfo.css';
import Paper from "@material-ui/core/Paper";

class AccountInfo extends Component {
  render() {
    return (
      <div className ="account-info-header">
      <div className = "accountForms">
      <Paper className="paper-account-Container">
        <h1> Account Info Here:  </h1>
        <h1> First Name:  </h1>
        <h1> Last Name:  </h1>
        <h1> Orders: </h1>
        <h1> Other Info </h1>
        </Paper>
        </div>
      </div>
    )
  }
}

export default AccountInfo;
