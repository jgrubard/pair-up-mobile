import axios from 'axios'
import productionUrl from './productionUrl';

const GET_FORMS = 'GET_FORMS';

const getForms = (forms) => ({ type: GET_FORMS, forms })

export const getFormsFromServer = () => {
  return disaptch => {
    return axios.get(productionUrl + '/api/forms')
      .then(result => result.data)
      .then(forms => disaptch(getForms(forms)))
  }
}

const store = (state = [], action) => {
  switch (action.type) {
    case GET_FORMS:
      return action.forms;
    default:
      return state;
  }
}

export default store;
