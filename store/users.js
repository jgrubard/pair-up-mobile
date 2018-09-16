import axios from 'axios';
import productionUrl from './productionUrl';

const GET_USERS = 'GET_USERS'
const UPDATE_USER = 'UPDATE_USER';

const getUsers = users => ({ type: GET_USERS, users });
export const updateUser = user => ({ type: UPDATE_USER, user });

export const getUsersFromServer = () => {
  return dispatch => {
    return axios.get(productionUrl + '/api/users')
      .then(result => result.data)
      .then(users => dispatch(getUsers(users)))
  }
}

export const updateUserOnServer = (user) => {
  const { id } = user;
  return dispatch => {
    return axios.put(productionUrl + `/api/users/${id}`, user)
      .then(result => result.data)
      .then(user => dispatch(updateUser(user)));
  };
};

const store = (state = [], action) => {
  let users;
  switch (action.type) {
  case GET_USERS:
    return action.users;
  case UPDATE_USER:
    users = state.filter(user => user.id !== action.user.id)
    return [ ...users, action.user ];
  default:
    return state;
  }
};

export default store;

