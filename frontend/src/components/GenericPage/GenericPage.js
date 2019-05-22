import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import "./GenericPage.css";

export default class GenericPage extends Component {
  render() {
    let pageText = this.props.pageText;

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
