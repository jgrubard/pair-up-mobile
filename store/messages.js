import axios from 'axios';
import url from './productionUrl';

const GOT_MESSAGES = 'GOT_MESSAGES';

export const gotMessages = messages => ({ type: GOT_MESSAGES, messages });

export const getMessagesFromServer = (user1Id, user2Id) => {
  return dispatch => {
    return axios.get(url + `/api/conversations/${user1Id}/${user2Id}`)
      .then(result => result.data)
      .then(messages => dispatch(gotMessages(messages)));
  };
};

export const postMessageToServer = (text, user1, user2) => {
  return dispatch => {
    return axios.post(url + `/api/conversations`, { text, user1, user2 })
      .then(result => result.data)
      .then(message => dispatch(gotMessages(message)));
  };
};

const store = (state = [], action) => {
  switch (action.type) {
  case GOT_MESSAGES:
    return action.messages;
  default:
    return state;
  }
};

export default store;
