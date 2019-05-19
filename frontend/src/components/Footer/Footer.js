import React, { Component } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer-container">
        <Link to="/">
          <h1 className="footer-header">ECS193 ECOMMERCE</h1>
        </Link>
        <div className="footer-col footer-col--1">
          <div className="footer-col-list">
            <ul>
              <li className="footer-link">
                <Link to="/about">About</Link>
              </li>
              <li className="footer-link">
                <Link to="/faq">FAQ</Link>
              </li>
              {/* <li className="footer-link">Link 3</li>
              <li className="footer-link">Link 4</li> */}
            </ul>
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-col-list">
            <ul>
              <li className="footer-link">
                <Link to="/clubs">About Clubs</Link>
              </li>
              <li className="footer-link">
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              {/* <li className="footer-link">Link 3</li>
              <li className="footer-link">Link 4</li> */}
            </ul>
          </div>
        </div>
        <div className="footer-col">
          <Link to="/terms">Terms and Services</Link>
        </div>
      </footer>
    );
  }
}
