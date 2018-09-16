import axios from 'axios';
import productionUrl from './productionUrl';

const GET_USER_REQUESTS = 'GET_USER_REQUESTS';
const CREATE_USER_REQUEST = 'CREATE_USER_REQUEST';
const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
const DELETE_USER_REQUEST = 'DELETE_USER_REQUEST';

const getUserRequests = (userRequests) => ({ type: GET_USER_REQUESTS, userRequests });
export const createUserRequest = (userRequest) => ({ type: CREATE_USER_REQUEST, userRequest });
export const updateUserRequest = (userRequest) => ({ type: UPDATE_USER_REQUEST, userRequest });
export const deleteUserRequest = (id) => ({ type: DELETE_USER_REQUEST, id })

export const getUserRequestsFromServer = () => {
  return dispatch => {
    return axios.get(productionUrl + '/api/userRequests')
      .then(result => result.data)
      .then(userRequests => dispatch(getUserRequests(userRequests)))
  }
}

export const createUserRequestOnServer = (userRequest) => {
  return dispatch => {
    return axios.post(productionUrl + '/api/userRequests', userRequest)
      .then(result => result.data)
      .then(userRequest => dispatch(createUserRequest(userRequest)))
  }
}

export const updateUserRequestOnServer = (userRequest) => {
  const { id } = userRequest;
  return dispatch => {
    return axios.put(productionUrl + `/api/userRequests/${id}`, userRequest)
      .then(result => result.data)
      .then(userRequest => {
        dispatch(updateUserRequest(userRequest));
      });
  };
};

export const deleteUserRequestFromServer = (id) => {
  return dispatch => {
    return axios.delete(productionUrl + `/api/userRequests/${id}`)
      .then(() => dispatch(deleteUserRequest(id)))
  }
}

const store = (state = [], action) => {
  let userRequests;
  switch (action.type) {
    case GET_USER_REQUESTS:
      return action.userRequests;
    case CREATE_USER_REQUEST:
      return [ ...state, action.userRequest ];
    case UPDATE_USER_REQUEST:
      userRequests = state.filter(request => request.id !== action.userRequest.id);
      return [ ...userRequests, action.userRequest ];
    case DELETE_USER_REQUEST:
      return state.filter(request => request.id !== action.id);
    default:
      return state;
  }
}

export default store;
