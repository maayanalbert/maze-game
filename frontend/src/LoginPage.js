
// renders the view where you login

import React, { Component } from 'react';
import './App.css';
import { login, getData } from './util/Auth.js';
import store from './store';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import PasswordField from 'material-ui-password-field'

const style = {
  margin: 12,
};

export class LoginPage extends Component{
  constructor(props) {
    super(props);
    this.state = {username: '', password: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createNewAccount = this.createNewAccount.bind(this);
  }

  //////////////////////////////////////
  // saves the content in each text box as it's being written

  handleChange(event) {
    this.setState({username: event.target.value});
    console.log(this.state.username)
  }

  handleChangePassword(event) {
    this.setState({password: event.target.value});
  }

  //////////////////////////////////////

  // when the user submits, authenticates account by sending username and pass-
  // word to the backend and save the account information in local storage 
  handleSubmit(event) {
    login(this.state.username, this.state.password);
    if(store.getState().token != null){
      this.props.setLoggedIn()
      localStorage.setItem('username', this.state.username);
      localStorage.setItem('password', this.state.password);
      localStorage.setItem('loggedIn', true)
    }
    event.preventDefault();
  }

  // logs in with a dummy account when switching to create account so user can
  // access he database.
  createNewAccount(){
    login('dummy', "dummypassword")
    this.props.createAccount()
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
        <PasswordField
          hintText="Password" value={this.state.password} 
          onChange={this.handleChangePassword} style={style}/>
        <br />
        <br />
        <RaisedButton primary={true} label="Login" onClick={this.handleSubmit} 
          style={style}/>
      </div>
    );
  }
}


export default LoginPage;
