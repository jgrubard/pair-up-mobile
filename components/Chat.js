import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import { getMessagesFromServer, postMessageToServer } from '../store';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.onSend = this.onSend.bind(this);
  }

  componentDidMount() {
    const { user1, user2, getMessages } = this.props;
    getMessages(user1.id, user2.id);
  }

  onSend(message) {
    const { user1, user2 } = this.props;
    this.props.postMessage(message[0].text, user1, user2);
  }

  render() {
    return (
      <GiftedChat
        messages={ this.props.messages }
        onSend={message => {this.onSend(message)}}
        user={{
          _id: this.props.user1.id,
        }}
      />
    );
  }
}

const mapState = ({ messages, user }, { navigation }) => ({
  messages,
  user1: user,
  user2: navigation.getParam('receivingUser', 'no user')
});

const mapDispatch = dispatch => ({
  getMessages(user1Id, user2Id) {
    dispatch(getMessagesFromServer(user1Id, user2Id));
  },
  postMessage(text, user1, user2) {
    dispatch(postMessageToServer(text, user1, user2));
  }
});

export default connect(mapState, mapDispatch)(Chat);
