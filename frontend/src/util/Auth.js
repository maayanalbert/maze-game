import axios from 'axios';
import _ from 'lodash';
import store from '../store';
import { setToken } from '../actions'
import { URL, LOGIN } from '../config/Api';

function session(username, password) {
  if (!loggedIn()) {
    return axios;
  }
  return axios.create({
    method: 'post',
    headers: {
      Authorization: 'Token ' + store.getState().token
    },
  });
}

export function addAccount(username, password, facebookEmail) {
  return session(username, password)
    .post(URL + '/newaccount', {
      'newUsername': username,
      'newPassword': password,
      'newFacebookEmail': facebookEmail
    })
}


export function InvalidCredentialsException(message) {
    this.message = message;
    this.name = 'InvalidCredentialsException';
}

export function addNewAccount(username, password){
}


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
      alert("You have entered an incorrect username or password.")
      // raise different exception if due to invalid credentials
      if (_.get(error, 'response.status') === 400) {
        throw new InvalidCredentialsException(error);
      }
      throw error;
    });
}

export function getData() {
  return session().get(URL + '/data')
}

export function createAccount(username, password, facebookEmail) {
  return addAccount(username, password, facebookEmail)
}

export function loggedIn() {
  return store.getState().token != null;
}