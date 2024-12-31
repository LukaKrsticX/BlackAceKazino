import React, { Component } from 'react'

class Register extends Component {
  constructor()
  {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      repassword: '',
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
    onChange(e) {
      this.setState({[e.target.name]: e.target.value })
    }

    onSubmit(e){
      e.preventDefault(); 
    }
  render() {
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Registruj se</h1>
              <p className="lead text-center">Kreiraj svoj nalog na BlackAce Kazinu!</p>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input type="text" className="form-control form-control-lg" placeholder="Ime" name="name" 
                  value = {this.state.name}
                  onChange={this.onChange}/>
                </div>
                <div className="form-group">
                  <input type="email" className="form-control form-control-lg" placeholder="e-mail adresa" name="email" 
                  value = {this.state.email}
                  onChange={this.onChange}/>
                  
                </div>
                <div className="form-group">
                  <input type="password" className="form-control form-control-lg" placeholder="Upiši šifru" name="password" 
                  value = {this.state.password}
                  onChange={this.onChange}/>
                </div>
                <div className="form-group">
                  <input type="password" className="form-control form-control-lg" placeholder="Ponovi šifru" name="repassword" 
                  value = {this.state.repassword}
                  onChange={this.onChange}/>
                </div>
                <button type="submit" className="btn btn-info btn-block mt-4">Pošalji zahtev</button>
              </form>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default Register;
