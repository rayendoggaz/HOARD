// WelcomePage.js

import React from "react";
import { Link } from "react-router-dom";
import "./WelcomePage.css";

const WelcomePage = () => {
  return (
    <div className="wel">
      <div className="welcome-container">
        <h1 className="welcome-title">Welcome to HOARD</h1>
        <p className="welcome-message">
          We're excited to have you here! Explore our features and services
          below.
        </p>
        <div className="button-container">
          <Link to="/signin" className="welcome-button">
            Sign In
          </Link>
          <Link to="/signup" className="welcome-button">
            Sign Up
          </Link>
        </div>
        <div className="features-section">
          <h2 className="features-title">Key Features</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <h3 className="feature-title">File Upload</h3>
              <p className="feature-description">
                Easily upload your files to our platform.
              </p>
            </div>
            <div className="feature-card">
              <h3 className="feature-title">Organize</h3>
              <p className="feature-description">
                Effortlessly organize your files into folders.
              </p>
            </div>
            <div className="feature-card">
              <h3 className="feature-title">Access Anywhere</h3>
              <p className="feature-description">
                Access your files from anywhere, anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
