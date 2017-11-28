import React, { Component } from 'react';
import './App.css';
import { getData } from './util/Auth.js';
import store from './store';
import { setToken } from './actions'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { plugInPassword } from './util/Auth.js';
import ReactInterval from 'react-interval';
import { getLogs } from './util/Auth.js';


const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

export class WelcomePage extends Component{
  constructor(props) {
    super(props);
    this.state = {fbpassword: '', logs: 0};

    this.logout = this.logout.bind(this);
    this.handleSetPassword = this.handleSetPassword.bind(this);
    this.startTracking = this.startTracking.bind(this);
    this.upDateLogs = this.upDateLogs.bind(this);
  }

  getDataFromAPI() {
    getData().then(function(response) {
      alert(response.data.phil)
    })
  }


  handleSetPassword(event) {
    this.setState({fbpassword: event.target.value});
  }

  startTracking(event) {
    console.log(this.state.fbpassword)
    plugInPassword(this.state.fbpassword)
    localStorage.setItem('tracking', true)
    this.setState({fbpassword: null})
  }

  logout(){
    store.dispatch(setToken(null));
    localStorage.setItem('loggedIn', false)
    localStorage.setItem('username', null)
    localStorage.setItem('password', null)
    this.props.setLoggedOut()
  }

  renderMessage(){
   return (
    'Hi ' + String(localStorage.getItem('username')) + ', you are logged in.') 
  }

  renderContent(){
    return(
      <div>
      <h2 className="App-header-text">
      To start recording when your friends are online, enter your facebook password below.
      </h2>
      <br />
      <h2 className="App-header-text">
      We will only use your password to authenticate your account and will not save it.
      </h2>
      <br />
      <TextField
        hintText="Facebook Password" value={this.state.fbpassword} onChange={this.handleSetPassword}/>
      <br />
      <br />
      <RaisedButton primary={true} label="Start Tracking" onClick={this.startTracking} />
      </div>
      )  
  }

  upDateLogs(){
    this.setState({logs: 1})
    getLogs().then(function(response) {
      this.setState({logs: response.data})
    })
    console.log(this.state.logs)
  }

  render() {
    return (
      <div>
      <br />
      {this.renderContent()}
      <ReactInterval timeout={240000} enabled={eval(localStorage.getItem('tracking'))}
        callback={this.upDateLogs} />
      </div>
    );
  }
}


export default WelcomePage;
