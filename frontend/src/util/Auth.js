
// In addition to authenticating clients, this file contains all of the
// functions that map to the backend's views

import axios from 'axios';
import _ from 'lodash';
import store from '../store';
import { setToken } from '../actions'
import { URL, LOGIN } from '../config/Api';

// Adds an auth token if already logged in, if just logged in, creates a
// token.
function session() {
  // if already logged in, just send the packet as is
  if (!loggedIn()) {
    return axios;
  }
  // if just logged in, create the token
  return axios.create({
    method: 'post',
    headers: {
      Authorization: 'Token ' + store.getState().token
    },
  });
}

// Sends new account information to the backend to be made into an account.
export function addAccount(username, password, facebookEmail) {
  return session()
    .post(URL + '/newaccount', {
      'newUsername': username,
      'newPassword': password,
      'newFacebookEmail': facebookEmail
    })
}

// Send password to the backend so that the scraper can start running.
export function plugInPassword(fbpassword){
  return session()
    .post(URL + '/password', {
      'fbpassword': fbpassword,
      'username': localStorage.getItem('username')
    })
}

// Send a request to get all of the logs associated with that profile.
export function getLogs(){
  return session()
    .post(URL + '/logs', {
      'username': localStorage.getItem('username')
    })
}

// Update tracking feild when tracking is turned off
export function stopTracking(){
  return session()
    .post(URL + '/stopTracking', {
      'username': localStorage.getItem('username')
    })
}

// Check if we are currently tracking friend data
export function checkTracking(){
  return session()
    .post(URL + '/checkTracking', {
      'username': localStorage.getItem('username')
    })
}


// Create an exception if the credentials are invalid
export function InvalidCredentialsException(message) {
  this.message = message;
  this.name = 'InvalidCredentialsException';
}

// sends login information to the backend to be authenticated. Raises an 
// error if information is incorrect.
export function login(username, password) {
  return session(null, null)
    .post(URL + LOGIN, {
      username,
      password
    })
    .then(function (response) {
      store.dispatch(setToken(response.data.token));
    })
    .catch(function (error) {
      //alert("You have entered an incorrect username or password.")
      // raise different exception if due to invalid credentials
      if (_.get(error, 'response.status') === 400) {
        throw new InvalidCredentialsException(error);
      }
      throw error;
    });
}

// calls addAccount
export function createAccount(username, password, facebookEmail) {
  return addAccount(username, password, facebookEmail)
}

// checks if the user has already been logged in
export function loggedIn() {
  return store.getState().token != null;
}