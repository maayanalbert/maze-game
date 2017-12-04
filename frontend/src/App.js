
// Manage the pages and render the app.

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginPage from './LoginPage.js';
import WelcomePage from './WelcomePage.js';
import CreateAccountPage from './CreateAccountPage.js';
import { login, checkTracking } from './util/Auth.js';
import store from './store';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { setToken } from './actions'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {pageDisplayed: 'login'};

    this.setLoginPageActive = this.setLoginPageActive.bind(this);
    this.setWelcomePageActive = this.setWelcomePageActive.bind(this);
    this.setCreateAccountPageActive = this.setCreateAccountPageActive.bind(this);
    this.createNewAccount = this.createNewAccount.bind(this);
    this.logout = this.logout.bind(this);
  }

  /////////////////////////////////////
  // Sets the correct page to be active when said functions are called.

  setLoginPageActive() {
    this.setState({pageDisplayed: 'login'})
  }

  setWelcomePageActive() {
    this.setState({pageDisplayed: 'loggedIn'})
  }

  setCreateAccountPageActive(){
    this.setState({pageDisplayed: 'createAccount'})
  }

  ////////////////////////////////////

  // Selects what page to render.
  renderPage(){

    // If localStorage doesn't have a value for loggedIn (ie site is being 
    // visited for the first time), set it to false.
    if(localStorage.getItem('loggedIn') == null){
      localStorage.setItem('loggedIn', false)
    }

    // Check whether we are logged in or not
    var status = eval(localStorage.getItem('loggedIn'))

    // If yes, automatically authenticate ourselves and render the welcomePage
    if(status == true){
      if(this.state.pageDisplayed != 'loggedIn'){
      login(localStorage.getItem('username'), localStorage.getItem('password'));
      this.setState({pageDisplayed: 'loggedIn'})
      }
    }

    // Render the appropriate pages based on the current state.
    if(this.state.pageDisplayed == 'login'){
      return <LoginPage setLoggedIn={this.setWelcomePageActive} 
          createAccount ={this.setCreateAccountPageActive} />
    }else if(this.state.pageDisplayed == 'loggedIn'){
      return <WelcomePage setLoggedOut={this.setLoginPageActive}/>
    }else{
      return <CreateAccountPage setLoggedOut={this.setLoginPageActive} 
        setLoggedIn={this.setWelcomePageActive}/>
    }
  }

  // Set the state to that of the the createAccount page. In addition, login
  // with a dummy account so that we can access the backend to add a user.
  createNewAccount(){
    login('dummy', "dummypassword")
    this.setState({pageDisplayed: 'createAccount'})
  }

  // There are two header buttons; create account and login. If logged in,
  // render the logout button, if not, render the create account button.
  renderHeaderButton(){
    if(this.state.pageDisplayed == 'login'){
        return(<RaisedButton label="new account" primary={true} 
          onClick={this.createNewAccount}></RaisedButton>)
    }else{
        return(<RaisedButton label="logout" primary={true} 
          onClick={this.logout}></RaisedButton>)
    }
  }

  // When logging out, set the auth token to null and the account information
  // stored in local storage to none as well.
  logout(){
    store.dispatch(setToken(null));
    localStorage.setItem('loggedIn', false)
    localStorage.setItem('username', null)
    localStorage.setItem('password', null)
    localStorage.setItem('logs', null)
    this.setLoginPageActive()
  }

  render() {
    return (
    <MuiThemeProvider>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">postUp</h1>
          {this.renderHeaderButton()}
        </header>
        <p className="App-intro">
        </p>
        {this.renderPage()}
      </div>
    </MuiThemeProvider>
    );
  }
}

export default App;
