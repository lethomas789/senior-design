import React, { Component } from 'react'
import axios from "axios";
import { Redirect } from "react-router-dom";

export default class EmailConfirmation extends Component {
  state = {
    isConfirmed: false,
    toLogin: false,
  };

  componentDidMount() {
    // check link, call route
    const { token } = this.props.match.params;
    const apiURL = '/api/signup/confirmEmail';
    axios.get(apiURL, { params: { token }}).then(res => {
      if (res.data.success === true) {
        this.setState(() => ({ isConfirmed: true }));
        setTimeout(() => {
          this.setState(() => ({ toLogin: true }));
        }, 5000);
      }
    })
    .catch(err => {
      console.log('Error in email confirmation:', err);
      this.props.notifier({
        title: 'Error',
        message: err.toString(),
        type: 'warning',
      });
    });
  }
  
  render() {
    if (!this.state.isConfirmed) {
      return (
        <div>
          Sorry, there was an error in confirming your email. Please contact
          the support email and we will fix the problem.
        </div>
      )
    }
    else if (this.state.toLogin) {
      return <Redirect to='/login' />;
    }

    return (
      <div>
        Email confirmed. Thanks for signing up!
        Redirecting to login ...
      </div>
    )
  }
}

