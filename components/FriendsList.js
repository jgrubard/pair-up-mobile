import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

class FriendsList extends Component {
  constructor() {
    super();
    this.state = {
      blocked: false
    }
  }
  render() {
    const { friends, organizations } = this.props;
    // console.log('FRIENDS:', friends);
    return (
      <ImageBackground source={ require('../assets/images/bg.png') } style={{ height: '100%', width: '100%' }}>
        <Text>Friends List</Text>
        <View>
          {
            friends.map(friendInfo => {
              const [ friend, orgId ] = friendInfo;
              const org = organizations.find(org => org.id === orgId);
              return (
                <View>
                <Text key={friend.id}>
                  {org.name}: {friend.fullName}
                </Text>
                <Button
                  color='#fff'
                  onPress={() => {
                    console.log(this.state.blocked ? 'unblocked' : 'blocked')
                    this.setState({ blocked: !this.state.blocked });
                  }}
                  title={this.state.blocked ? 'UNBLOCK' : 'BLOCK'}
                  buttonStyle={ styles.blockButton }
                />
                </View>
              );
            })
          }

        </View>
      </ImageBackground>
    );
  }
}

const mapState = ({ user, users, userRequests, organizations }) => {
  const friends = userRequests.reduce((memo, req) => {
    let friend;
    if(req.status === 'accepted') {
      if(req.requesterId === user.id) {
        friend = users.find(user => user.id === req.responderId);
      } else if(req.responderId === user.id) {
        friend = users.find(user => user.id === req.requesterId);
      }
      memo.push([friend, req.organizationId]);
    }
    return memo;
  }, []);
  return { friends, organizations }
}

export default connect(mapState)(FriendsList);

const styles = StyleSheet.create({
  blockButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 50,
    marginTop: 15
  }
});