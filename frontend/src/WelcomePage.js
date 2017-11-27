import React, { Component } from 'react';
import './App.css';
import { getData } from './util/Auth.js';
import store from './store';
import { setToken } from './actions'

export class WelcomePage extends Component{
  constructor(props) {
    super(props);
    this.state = {username: '', password: ''};

    this.logout = this.logout.bind(this);
  }

  getDataFromAPI() {
    getData().then(function(response) {
      alert(response.data.phil)
    })
  }

  logout(){
    store.dispatch(setToken(null));
    this.props.setLoggedOut()
  }

  render() {
    return (
      <div>
      You are logged in.
      <button onClick={this.getDataFromAPI}>get data</button>
      <button onClick={this.logout}>Logout</button>
      </div>
    );
  }
}


export default WelcomePage;
