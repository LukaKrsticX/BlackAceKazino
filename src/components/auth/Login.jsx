import React, { Component } from 'react';
import { Link } from 'react-router-dom';

 class Login extends Component {
  render() {
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Uloguj se</h1>
              <p className="lead text-center">Započni nezaboravnu zabavu!</p>
              <form action="">
                <div className="form-group">
                  <input type="email" className="form-control form-control-lg" placeholder="e-mail adresa" name="email"/>
                </div>
                <div className="form-group">
                  <input type="password" className="form-control form-control-lg" placeholder="Šifra" name="password"/>
                </div>
                <button type="submit" className="btn btn-danger btn-block mt-4">Uloguj se</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Login;
