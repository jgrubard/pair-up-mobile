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
    // return null;
    return (
      <ImageBackground source={ require('../assets/images/bg.png') } style={{ height: '100%', width: '100%' }}>
        <Text>Friends List</Text>
        <View>
          { 
            !friends.length ? (
              <Text>You have ZERO friends</Text>
            ) : (
              <View>
            {
              friends.map(friendInfo => {
                const [ friend, orgId ] = friendInfo;
                const org = organizations.find(org => org.id === orgId);
                return (
                  <View key={friend.id}>
                  <Text>
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
            )
            
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
        // console.log('if 1')
        friend = users.find(user => user.id === req.responderId);
      } else if(req.responderId === user.id) {
        // console.log('if 2')
        // console.log(req.requesterId)
        friend = users.find(user => {
          // console.log('find', user.id, req.requesterId);
          return user.id === req.requesterId
        });
        // console.log(friend);
      }
      // console.log('no if')
      memo.push([friend, req.organizationId]);
    }
    return memo;
  }, []);
  console.log(friends);
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