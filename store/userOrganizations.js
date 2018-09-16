import axios from 'axios';
import productionUrl from './productionUrl';

const GET_USER_ORGANIZATIONS = 'GET_USER_ORGANIZATIONS';
const CREATE_USER_ORGANIZATION = 'CREATE_USER_ORGANIZATION';

const getUserOrganizations = (userOrganizations) => ({ type: GET_USER_ORGANIZATIONS, userOrganizations });
export const createUserOrganization = (userOrganization) => ({ type: CREATE_USER_ORGANIZATION, userOrganization });

export const getUserOrganizationsFromServer = () => {
  return dispatch => {
    return axios.get(productionUrl + '/api/userOrganizations')
      .then(result => result.data)
      .then(userOrganizations => dispatch(getUserOrganizations(userOrganizations)))
  }
}

const store = (state = [], action) => {
  switch (action.type) {
    case GET_USER_ORGANIZATIONS:
      return action.userOrganizations;
    case CREATE_USER_ORGANIZATION:
      return [ ...state, action.userOrganization ];
    default:
      return state;
  }
}

export default store;
