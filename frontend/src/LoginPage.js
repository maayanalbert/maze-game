import React, { Component } from 'react';
import './App.css';
import { login, getData } from './util/Auth.js';
import store from './store';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

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

   handleChange(event) {
    this.setState({username: event.target.value});
    console.log(this.state.username)

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
      localStorage.setItem('username', this.state.username);
      localStorage.setItem('password', this.state.password);
      localStorage.setItem('loggedIn', true)
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

    
    <br />
    <TextField value={this.state.username} onChange={this.handleChange} 
      hintText="Username" style={style}
    />
    <br />
    <br />
    <TextField
      hintText="Password" value={this.state.password} onChange={this.handleChangePassword}
    style={style}/>
    <br />
    <br />
    <RaisedButton primary={true} label="Login" onClick={this.handleSubmit} style={style}/>


      </div>
    );
  }
}


export default LoginPage;
