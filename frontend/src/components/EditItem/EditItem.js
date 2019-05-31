import React, { Component } from "react";
import "./EditItem.css";
import axios from "axios";
// import axios from 'axios';
import { connect } from "react-redux";
// import actions from "../../store/actions";
// import Grid from '@material-ui/core/Grid';
// import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";

class EditItem extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    clickFunction: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name
    };
  }

  //onclick function, call function that was passed as a prop to EditItemView component
  //pass name after being clicked to parent component to fill in form data
  updateFormAferClicked = () => {
    this.props.clickFunction(this.state.name);
  };

  componentDidMount() {
    // call a route to check if they are logged in and an admin
    const apiURL = "/api/adminUser/checkAdmin";
    axios
      .get(apiURL, {
        withCredentials: true
      })
      .then(res => {
        // user not an admin
        if (res.data.success === false) {
          this.props.notifier({
            title: "Warning",
            message: "Not an admin. Access denied.",
            type: "warning"
          });
          this.props.history.push("/login");
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

  render() {
    return (
      <div className="editItem">
        <h2 id="selectEditItem" onClick={this.updateFormAferClicked}>
          {this.props.name}
        </h2>
      </div>
    );
  }
}

export default connect(
  null,
  null
)(EditItem);
