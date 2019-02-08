import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import ButtonAppBar from './components/ButtonAppBar/ButtonAppBar';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <ButtonAppBar />
          <Route exact path = "/" component = {Home} />
          <Route exact path = "/signup" component = {Signup} />
          <Route exact path = "/login" component = {Login} />
        </div>
      </Router>
    );
  }
}

export default App;
