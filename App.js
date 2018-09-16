import React from 'react';
import { Provider } from 'react-redux';
import store from './store';

import MainStack from './components/MainStack';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={ store }>
        <MainStack />
      </Provider>
    );
  }
}
