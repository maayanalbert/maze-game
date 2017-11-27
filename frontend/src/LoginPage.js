import React, { Component } from 'react';
import './App.css';
import { login, getData } from './util/Auth.js';
import store from './store';

export class LoginPage extends Component{
  constructor(props) {
    super(props);
    this.state = {username: '', password: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createNewAccount = this.createNewAccount.bind(this);
  }

   handleChange(event) {
    this.setState({username: event.target.value});
  }

   handleChangePassword(event) {
    this.setState({password: event.target.value});
  }

  handleSubmit(event) {
    // login(this.state.username, this.state.password).then(() => {
    //   this.props.setLoggedIn();
    // })
    // alert('A username was submitted: ' + this.state.username + 
    //   "\nA password was submitted: " + this.state.password);
    login(this.state.username, this.state.password);
    if(store.getState().token != null){
      this.props.setLoggedIn()
    }
    event.preventDefault();
  }

  createNewAccount(){
    console.log()
    login('dummy', "dummypassword")
    this.props.createAccount()
  }

  render() {
    return (
      <div>
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.username} onChange={this.handleChange} />
        </label>
        <label>
          Password:
          <input type="text" value={this.state.password} onChange={this.handleChangePassword} />
        </label>
        <input type="submit" value="Submit" />
      </form>

      <div>
        <button onClick={this.createNewAccount}>Create a New Account</button>
      </div>
      </div>
    );
  }
}


export default LoginPage;
