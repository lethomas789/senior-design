import React, { Component } from 'react';
import actions from '../../store/actions';
import { connect } from 'react-redux';
import axios from 'axios';

class ShopItemDetailed extends Component {
  constructor(props){
    super(props);
    this.state = {
      imageLink: '',
      productInfo: '',
      productName: '',
      productPrice: ''
    };
  }

  //load item info by calling getProductInfo api and render to screen
  componentDidMount(){
    const apiURL = '/api/getProductInfo';
    axios.get(apiURL, {
      params:{
        pid: this.props.pid
      }
    })
    .then(res => {
      //if successfully got product info, update component
      if(res.data.success === true){
        //update state of component
        this.setState({
          productInfo: res.data.productInfo,
          productName: res.data.productName,
          productPrice: res.data.productPrice,
          imageLink: res.data.productPicture
        })
      }

      else{
        alert(res.data.message);
      }
    })
    .catch(err => {
      alert(err);
    })
  }

  render() {
    return (
      <div>
        <img src = {this.props.imageLink}/>
        <h3> {this.state.productName} </h3>
        <p> ${this.state.productPrice} </p>
        <p> {this.state.productInfo} </p>
      </div>
    )
  }
}

//obtain state from store as props for component
//get login value and user email
const mapStateToProps = state => {
  return{
      pid: state.selectedItem.selectedItemID
  }
}

//dispatch action to reducer
//update which item was selected for detailed view of item
const mapDispatchToProps = dispatch => {
  return{
      
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ShopItemDetailed);
