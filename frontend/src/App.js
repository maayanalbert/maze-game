import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginPage from './LoginPage.js';
import WelcomePage from './WelcomePage.js';
import CreateAccountPage from './CreateAccountPage.js';
import { login, getData } from './util/Auth.js';
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

  setLoginPageActive() {
    this.setState({pageDisplayed: 'login'})
  }

  setWelcomePageActive() {
    console.log('hi')
    this.setState({pageDisplayed: 'loggedIn'})
  }

  setCreateAccountPageActive(){
    this.setState({pageDisplayed: 'createAccount'})
  }

  renderPage(){
    if(localStorage.getItem('loggedIn') == null){
      localStorage.setItem('loggedIn', false)
    }
    if(localStorage.getItem('tracking') == null){
      localStorage.setItem('tracking', false)
    }
    var status = eval(localStorage.getItem('loggedIn'))
    console.log(status)
    if(status == true){
      if(this.state.pageDisplayed != 'loggedIn'){
      console.log('hello')
      login(localStorage.getItem('username'), localStorage.getItem('password'));
      this.setState({pageDisplayed: 'loggedIn'})
      }
    }
    if(this.state.pageDisplayed == 'login'){
          return <LoginPage setLoggedIn={this.setWelcomePageActive} 
          createAccount ={this.setCreateAccountPageActive} />
    }else if(this.state.pageDisplayed == 'loggedIn'){
          return <WelcomePage setLoggedOut={this.setLoginPageActive}/>
    }else{
      return <CreateAccountPage setLoggedOut={this.setLoginPageActive} setLoggedIn={this.setWelcomePageActive}/>
    }
  }

  createNewAccount(){
    login('dummy', "dummypassword")
    this.setState({pageDisplayed: 'createAccount'})
  }

  renderHeaderButton(){
    if(this.state.pageDisplayed == 'login'){
        return(<RaisedButton label="new account" primary={true} onClick={this.createNewAccount}></RaisedButton>)
    }else{
        return(<RaisedButton label="logout" primary={true} onClick={this.logout}></RaisedButton>)
    }
  }

  logout(){
    store.dispatch(setToken(null));
    localStorage.setItem('loggedIn', false)
    localStorage.setItem('username', null)
    localStorage.setItem('password', null)
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
