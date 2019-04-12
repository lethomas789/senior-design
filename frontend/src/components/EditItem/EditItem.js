import React, { Component } from 'react';
import './EditItem.css';
import axios from 'axios';
import { connect } from "react-redux";
import actions from "../../store/actions";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class EditItem extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: this.props.name
    }
  }

  //onclick function, call function that was passed as a prop to EditItemView component
  updateFormAferClicked = () =>{
    console.log(this.props);
    console.log("calling parent function");
    this.props.clickFunction(this.state.name);
  }
  
  render() {
    return (
      <div className = "editItem">
        <h2 id = "selectEditItem" onClick = {this.updateFormAferClicked}> {this.props.name} </h2>
      </div>
    )
  }
}

export default connect(
  null,
  null  
)(EditItem);
