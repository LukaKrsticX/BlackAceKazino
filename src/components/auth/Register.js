import React from 'react'
import validationReg from './RegisterValidation'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
    // repassword: ''
  })

  const navigate = useNavigate();
  const [errors, setErrors] = useState({})


  const handleInput = (event) => {
    setValues(prev => ({
      ...prev, 
      [event.target.name]: event.target.value 
    }));
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors  = validationReg(values);
    setErrors(validationErrors );

    if(!validationErrors.name && !validationErrors.email && !validationErrors.password){
        axios.post('http://localhost:81/register', values)
        .then(res => {
          console.log('User registered successfully');
          navigate('/login')
        })
        .catch((err) => {
          console.error('Error registering user:', err);
        });
    }
  }
  return (
    <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Registruj se</h1>
              <p className="lead text-center">Kreiraj svoj nalog na BlackAce Kazinu!</p>
              <form action='' onSubmit={handleSubmit}>
                <div className="form-group">
                  <input type="text" className="form-control form-control-lg" placeholder="Ime" name="name"
                  onChange={handleInput}/>
                  {errors.name && <span className='text-info'>{errors.name}</span>}
                </div>
                <div className="form-group">
                  <input type="email" className="form-control form-control-lg" placeholder="e-mail adresa" name="email" 
                  onChange={handleInput}/>
                  {errors.email && <span className='text-info'>{errors.email}</span>}
                </div>
                <div className="form-group">
                  <input type="password" className="form-control form-control-lg" placeholder="Upiši šifru" name="password" 
                  onChange={handleInput}/>
                  {errors.password && <span className='text-info'>{errors.password}</span>}
                </div>
                {/* <div className="form-group">
                  <input type="password" className="form-control form-control-lg" placeholder="Ponovi šifru" name="repassword"
                  onChange={handleInput}/>
                  {errors.repassword && <span className='text-info'>{errors.repassword}</span>}
                </div> */}
                <button type="submit" className="btn btn-info btn-block mt-4">Pošalji zahtev</button>
              </form>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Register;