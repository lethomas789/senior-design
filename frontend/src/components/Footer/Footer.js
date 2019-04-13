import React, { Component } from 'react'
import './Footer.css';

export default class Footer extends Component {

  render() {
    return (
      <footer className='footer-container'>
        <div className="footer-col">
          TEST FOOTER WITH TEST COLORS 1 
          <div className="footer-col-list">
            <ul>
              <li className="footer-link">Link 1</li>
              <li className="footer-link">Link 2</li>
              <li className="footer-link">Link 3</li>
              <li className="footer-link">Link 4</li>
            </ul>
          </div>
        </div>
        <div className="footer-col">
          TEST FOOTER WITH TEST COLORS 2
          <div className="footer-col-list">
            <ul>
              <li className="footer-link">Link 1</li>
              <li className="footer-link">Link 2</li>
              <li className="footer-link">Link 3</li>
              <li className="footer-link">Link 4</li>
            </ul>
          </div>
        </div>
        <div className="footer-col">
          info box
        </div>
      </footer>
    )
  }
}

