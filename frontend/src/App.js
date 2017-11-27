import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginPage from './LoginPage.js';
import WelcomePage from './WelcomePage.js';
import CreateAccountPage from './CreateAccountPage.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {pageDisplayed: 'login'};
    this.setLoginPageActive = this.setLoginPageActive.bind(this);
    this.setWelcomePageActive = this.setWelcomePageActive.bind(this);
    this.setCreateAccountPageActive = this.setCreateAccountPageActive.bind(this);
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
    console.log(this.state.pageDisplayed)
    if(this.state.pageDisplayed == 'login'){
          return <LoginPage setLoggedIn={this.setWelcomePageActive} 
          createAccount ={this.setCreateAccountPageActive} />
    }else if(this.state.pageDisplayed == 'loggedIn'){
          return <WelcomePage setLoggedOut={this.setLoginPageActive}/>
    }else{
      return <CreateAccountPage/>
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
        </p>
        {this.renderPage()}
      </div>
    );
  }
}

export default App;
