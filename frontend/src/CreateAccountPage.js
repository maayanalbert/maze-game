import React, { Component } from 'react';
import './App.css';
import { login, getData } from './util/Auth.js';
import store from './store';
import { createAccount } from './util/Auth.js';

export class createAccountPage extends Component{
  constructor(props) {
    super(props);
    this.state = {username: '', password: '', facebookEmail: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeFacebookEmail = this.handleChangeFacebookEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.create = this.create.bind(this);
  }

   handleChange(event) {
    this.setState({username: event.target.value});
  }

   handleChangePassword(event) {
    this.setState({password: event.target.value});
  }

  handleChangeFacebookEmail(event) {
    this.setState({facebookEmail: event.target.value});
  }

  handleSubmit(event) {
    console.log('hi')
    // createAccount(this.state.username, this.state.password).then(function(response) {
    //   alert(response.data)
    // })
  }


  create(){
  createAccount(this.state.username, this.state.password, this.state.facebookEmail).then(function(response) {
      alert(response.data)
    })
    console.log('hi')
  }


  render() {
    return (
      <div>
      Create a new account here.
      <form>
        <label>
          Name:
          <input type="text" value={this.state.username} onChange={this.handleChange} />
        </label>
        <label>
          Password:
          <input type="text" value={this.state.password} onChange={this.handleChangePassword} />
        </label>
        <label>
          Facebook Email:
          <input type="text" value={this.state.facebookEmail} onChange={this.handleChangeFacebookEmail} />
        </label>
      </form>

      <div>
        <button onClick={this.create}>Create</button>
      </div>
      </div>
    );
  }
}


export default createAccountPage;
