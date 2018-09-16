import { createStore, applyMiddleware, combineReducers } from 'redux';
import { AsyncStorage } from 'react-native';
import thunk from 'redux-thunk';
import socket from './sockets';
import organizations from './organizations';
import user, { removeUser } from './sessions';
import users, { updateUser } from './users';
import organizationRequests, { updateOrganizationRequest } from './organizationRequests';
import userOrganizations, { createUserOrganization } from './userOrganizations';
import userRequests, { createUserRequest, updateUserRequest, deleteUserRequest } from './userRequests';
import forms from './forms';
import descriptions, { createDescription, updateDescription } from './descriptions';
import messages, { gotMessages } from './messages';

const middleware = applyMiddleware(thunk);
const reducers = combineReducers({ organizations, user, users, organizationRequests, userOrganizations, userRequests, forms, descriptions, messages });

const store = createStore(reducers, middleware);

socket.on('updatedOrganizationRequest', organizationRequest => {
  store.dispatch(updateOrganizationRequest(organizationRequest));
});

socket.on('newUserRequest', userRequest => {
  store.dispatch(createUserRequest(userRequest));
});

socket.on('updatedUser', user => {
  store.dispatch(updateUser(user));
});

socket.on('updatedUserRequest', userRequest => {
  store.dispatch(updateUserRequest(userRequest));
});

socket.on('deletedUserRequest', id => {
  store.dispatch(deleteUserRequest(id));
});

socket.on('newMessage', messages => {
  store.dispatch(gotMessages(messages));
});

socket.on('addUserOrganization', userOrganization => {
  store.dispatch(createUserOrganization(userOrganization));
});

socket.on('createdDescription', description => {
  store.dispatch(createDescription(description));
});

socket.on('updatedDescription', description => {
  store.dispatch(updateDescription(description));
});

export default store;
export * from './organizations';
export * from './sessions';
export * from './organizationRequests';
export * from './users';
export * from './userOrganizations';
export * from './userRequests';
export * from './forms';
export * from './descriptions';
export * from './messages';
