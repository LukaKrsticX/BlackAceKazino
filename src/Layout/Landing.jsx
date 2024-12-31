import React, { Component } from 'react';
import { Link } from 'react-router-dom';

 class Landing extends Component {
  render() {
    return (
      <div className="landing">
       <div className="dark-overlay landing-inner text-light">
          <div className="container">
           <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">Život je igra!</h1>
                <p className="lead"> Ko igra taj dobija, uloguj se i okreni kolo sreće!</p>
                <hr />
                <Link to={"/register"} className="btn btn-lg btn-danger mr-2">Registruj se</Link>
                <Link to={"/login"} className="btn btn-lg btn-dark">Uloguj se</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
    }
  }
  export default Landing;
  