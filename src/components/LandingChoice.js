import React, { useState } from 'react';
import axios from 'axios';
import './LandingChoice.css';
import { Link } from 'react-router-dom';
function LandingChoice(){

  return (
    <div className="landingChoice">
      <div className="dark-overlay landing-inner text-light">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-4">
              <Link to="/sport" className="card-link">
                <div className="card card-hover-effect text-light bg-dark" id='sports'>
                  <div className="card-body">
                    <h1 className="card-title text-center" id='Naslov'>Sport</h1>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-4">
              <Link to="/landingChoice" className="card-link">
                <div className="card card-hover-effect text-light bg-dark" id="rulet">
                  <div className="card-body">
                    <h1 className="card-title text-center" id="Naslov">Rulet</h1>
                  </div>
                  <div className="card-dark-overlay">
                    <div className="coming-soon-text">Coming Soon</div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-4">
              <Link to="/landingChoice" className="card-link">
                <div className="card card-hover-effect text-light bg-dark" id="blackJack">
                  <div className="card-body">
                    <h1 className="card-title text-center" id="Naslov">BlackJack</h1>
                  </div>
                  <div className="card-dark-overlay">
                    <div className="coming-soon-text">Coming Soon</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LandingChoice;
