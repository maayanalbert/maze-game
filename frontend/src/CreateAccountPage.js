
// renders the view where you create a new account

import React, { Component } from 'react';
import './App.css';
import { login, getData } from './util/Auth.js';
import store from './store';
import { createAccount } from './util/Auth.js';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 12,
};

export class createAccountPage extends Component{
  constructor(props) {
    super(props);
    this.state = {username: '', password: '', facebookEmail: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeFacebookEmail = this.handleChangeFacebookEmail.bind(this);
    this.create = this.create.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  //////////////////////////////////////
  // saves the content in each text box as it's being written

  handleChange(event) {
    this.setState({username: event.target.value});
  }

  handleChangePassword(event) {
    this.setState({password: event.target.value});
  }

  handleChangeFacebookEmail(event) {
    this.setState({facebookEmail: event.target.value});
  }

  //////////////////////////////////////

  // When the user hits submit, create a new account with the correct username, 
  // password, and facebook email.
  create(){
    createAccount(this.state.username, this.state.password, 
      this.state.facebookEmail).then(function(response) {
      alert(response.data)
    })
    console.log('hi')
    login(this.state.username, this.state.password);
    localStorage.setItem('username', this.state.username);
    localStorage.setItem('password', this.state.password);
    localStorage.setItem('loggedIn', true)
    this.props.setLoggedIn()
  }

  // sends user back to the login page if he/she clicks the go back button
  goBack(){
    this.props.setLoggedOut()
  }

  render() {
    return (
      <div>
        <br />
        <TextField 
          value={this.state.username} onChange={this.handleChange} 
          hintText="Username" style={style} />
        <br />
        <br />
        <TextField
          hintText="Password" value={this.state.password} 
          onChange={this.handleChangePassword} style={style}/>
        <br />
        <br />
        <TextField
          hintText="Login Email for Facebook" value={this.state.facebookEmail} 
          onChange={this.handleChangeFacebookEmail} style={style}/>
        <br />
        <br />
        <RaisedButton label="Back To Login" style={style} 
          onClick={this.goBack} />
        <RaisedButton primary={true} label="Create" onClick={this.create}/>
      </div>
    );
  }
}


export default createAccountPage;
