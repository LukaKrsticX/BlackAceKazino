import React, { useState } from 'react';
import axios from 'axios';
import validationLog from './auth/LoginValidation';
import { useNavigate } from 'react-router-dom';

function Login({ setUserRole, setUserData }) {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // Update input field values
  const handleInput = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // Handle login form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors(validationLog(values));

    try {
      const response = await axios.post('http://localhost:81/login', values);
      if (response.status === 200) {
        const { user } = response.data;
        const { userName, balance, email, isAdmin, isModerator } = user;

        localStorage.setItem('loggedInUser', JSON.stringify(user));

        // Determine user role
        setUserRole(isAdmin ? 'admin' : isModerator ? 'moderator' : 'user');
        setUserData({ userName, balance, email });
        navigate('/landingChoice');
      }
    } catch (error) {
      setLoginError(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Uloguj se</h1>
            <p className="lead text-center">Započni nezaboravnu zabavu!</p>
            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="form-group">
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="e-mail adresa"
                  name="email"
                  value={values.email}
                  onChange={handleInput}
                />
                {errors.email && <span className="text-info">{errors.email}</span>}
              </div>

              {/* Password Input */}
              <div className="form-group">
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Šifra"
                  name="password"
                  value={values.password}
                  onChange={handleInput}
                />
                {errors.password && <span className="text-info">{errors.password}</span>}
              </div>

              {/* Login Error */}
              {loginError && <div className="text-danger">{loginError}</div>}

              <button type="submit" className="btn btn-danger btn-block mt-4">
                Uloguj se
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
