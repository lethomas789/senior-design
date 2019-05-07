import React, { Component } from 'react';
import './Shop.css';
import ShopView from '../ShopView/ShopView';

export default class Shop extends Component{
    render(){
        return(
            <div>
                <ShopView notifier = {this.props.notifier}/>
            </div>
        );
    }
}


