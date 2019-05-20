import React, { Component } from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import "./GenericPage.css";
import { log } from "util";

export default class GenericPage extends Component {
  // static propTypes = {
  //   pageText: PropTypes.string.isRequired
  // };

  render() {
    if (this.props == null) {
      var { pageText } = this.props.location.state;
    }
    else if (this.props.pageText) {
      var { pageText } = this.props;
    }
    else {
      var pageText = "Error 404 Not Found"
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
