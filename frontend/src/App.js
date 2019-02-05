import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Signup from './components/Signup';
import Home from './components/Home';
import ButtonAppBar from './components/ButtonAppBar';


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <ButtonAppBar />
          <Route exact path = "/" component = {Home} />
          <Route path = "/Signup" component = {Signup} />
        </div>
      </Router>
    );
  }
}

export default App;
