import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AdminNavbar ({ userData, onLogout, balance}) {

  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(navigate);
  };

  return(
  <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
    <div className="container">
      <Link className="navbar-brand" to="/landingChoice">BlackAce</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="mobile-nav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <span className="nav-link">Welcome Admin, {userData.userName}</span>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
        <li className="nav-item">
              <Link className="nav-link" to='/odigrano'>Odigrano</Link>
          </li>
          <li className="nav-item">
            <span className="nav-link" id='balance'>Balance: {balance}$</span>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin-dashboard">Admin Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" onClick={handleLogout}>Izloguj se</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);
  }

export default AdminNavbar;
