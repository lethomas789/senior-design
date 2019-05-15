import React, { Component } from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import "./GenericPage.css";

export default class GenericPage extends Component {
  // static propTypes = {
  //   pageText: PropTypes.string.isRequired
  // };

  render() {
    if (this.props.pageText == null) {
      var { pageText } = this.props.location.state;
    }
    else {
      var { pageText } = this.props;
    }

    return (
      <div id="generic-page-container">
        <Paper
          id="generic-page-paper-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <h4>{pageText}</h4>
        </Paper>
      </div>
    );
  }
}
