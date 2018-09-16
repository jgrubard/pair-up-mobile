import axios from 'axios';
import { AsyncStorage } from 'react-native';
import productionUrl from './productionUrl';
import socket from './sockets';

const GOT_USER = 'GOT_USER';

const gotUser = user => ({ type: GOT_USER, user });


export const attemptLogin = (credentials, navigation) => {
  return dispatch => {
    return axios.post(productionUrl + '/api/sessions', credentials)
      .then(result => result.data)
      .then(token => {
        AsyncStorage.setItem('token', token);
        dispatch(getUserFromToken(token));
      })
      .then(() => navigation.navigate('Home'))
      .catch(err => {
        AsyncStorage.removeItem('token');
        return err;
      });
  };
};

export const signup = (userInfo, navigation) => {
  return dispatch => {
    return axios.post(productionUrl + '/api/sessions/signup', userInfo)
      .then(result => result.data)
      .then(token => {
        AsyncStorage.setItem('token', token);
        dispatch(getUserFromToken(token));
      })
      .then(() => navigation.navigate('Home'))
      .catch(err => {
        AsyncStorage.removeItem('token');
        return err;
      });
  };
};

export const getUserFromToken = token => {
  return dispatch => {
    return axios.get(productionUrl + `/api/sessions/${token}`)
      .then(result => result.data)
      .then(user => {
        dispatch(gotUser(user));
        socket.emit('mobileOnline', user.id);
      })
      .catch(err => {
        AsyncStorage.removeItem('token');
        return err;
      });
  };
};

export const updateLoggedUser = (user) => {
  return dispatch => dispatch(gotUser(user));
};

const store = (state = {}, action) => {
  switch (action.type) {
  case GOT_USER:
    return action.user;
  default:
    return state;
  }
};

export default store;
