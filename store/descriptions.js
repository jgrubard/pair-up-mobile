import axios from 'axios';
import productionUrl from './productionUrl';

const GET_DESCRIPTIONS = 'GET_DESCRIPTIONS';
const CREATE_DESCRIPTION = 'CREATE_DESCRIPTION';
const UPDATE_DESCRIPTION = 'UPDATE_DESCRIPTION';

const getDescriptions = (descriptions) => ({ type: GET_DESCRIPTIONS, descriptions });
export const createDescription = (description) => ({ type: CREATE_DESCRIPTION, description });
export const updateDescription = (description) => ({ type: UPDATE_DESCRIPTION, description });

export const getDescriptionsFromServer = () => {
  return dispatch => {
    return axios.get(productionUrl + '/api/descriptions')
      .then(result => result.data)
      .then(descriptions => dispatch(getDescriptions(descriptions)))
  }
}

export const createDescriptionOnServer = (description) => {
  return dispatch => {
    return axios.post(productionUrl + '/api/descriptions', description)
      .then(result => result.data)
      .then(description => dispatch(createDescription(description)))
  }
}

export const updateDescriptionOnServer = (description) => {
  return dispatch => {
    return axios.put(productionUrl + `/api/descriptions/${description.id}`, description)
      .then(result => result.data)
      .then(description => dispatch(updateDescription(description)))
  }
}

const store = (state = [], action) => {
  let descriptions;
  switch (action.type) {
    case GET_DESCRIPTIONS:
      return action.descriptions;
    case CREATE_DESCRIPTION:
      return [ ...state, action.description ];
    case UPDATE_DESCRIPTION:
    descriptions = state.filter(des => des.id !== action.description.id)
      return [ ...descriptions, action.description ];
    default:
      return state;
  }
}

export default store;
