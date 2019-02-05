import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Signup from './Signup';
import Home from './Home';

import {BrowserRouter as Router, Route} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path = "/" component = {Home} />
          <Route path = "/Signup" component = {Signup} />
        </div>
      </Router>
    );
  }
}

export default App;
