import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import About from './components/About/About';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import ButtonAppBar from './components/ButtonAppBar/ButtonAppBar';
import Shop from './components/Shop/Shop';
import Cart from './components/Cart/Cart';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <ButtonAppBar />
          <Route exact path = "/" component = {Home} />
          <Route exact path = "/about" component = {About} />
          <Route exact path = "/shop" component = {Shop}/>
          <Route exact path = "/signup" component = {Signup} />
          <Route exact path = "/login" component = {Login} /> 
          <Route exact path = "/cart" component = {Cart}/>
        </div>
      </Router>
    );
  }
}

export default App;
