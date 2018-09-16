import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Text, Button, Badge } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { updateUserRequestOnServer, deleteUserRequestFromServer } from '../store';

class UserRequests extends Component {
  static navigationOptions = ({ screenProps }) => {
    return {
      tabBarIcon: () => {
        return(
          <View>
            <Icon size={22} name='users' color="#02a4ff" />
            {
              screenProps.requestCount > 0 && (
                <View style={{ left: 20, top: -25, backgroundColor: 'red', borderRadius: 15, width: 20, height: 20}}>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center', color: 'white' }}>
                    {screenProps.requestCount}
                  </Text>
                </View>
              )
            }
          </View>
        );
      }
    }
  }

  render() {
    const { user, users, receivedRequests, updateUserRequest, deleteUserRequest } = this.props;
    return (
      <ImageBackground source={ require('../assets/images/bg.png') } style={{ height: '100%', width: '100%' }}>
      <View style={ styles.container }>
        {
          receivedRequests.map(request => {
            const { id, requesterId, responderId, organizationId, status } = request;
            const requester = users.find(user => user.id === requesterId)
            return (
              <View
                key={id}
                style={ styles.requestContainer }
              >
                <View style={ styles.iconContainer }>
                  <Icon size={100} name='comments' color="#fff" />
                </View>
                <View style={ styles.infoContainer }>
                <Text style={ styles.name }>{requester.fullName}</Text>

                { status === 'pending' &&
                  <View>
                    <Button
                      buttonStyle={ styles.acceptButton }
                      title='ACCEPT'
                      color='#02a4ff'
                      onPress={ () => updateUserRequest({ id, requesterId, responderId, organizationId, status: 'accepted' }) }
                    />
                    <Button
                      color='#fff'
                      buttonStyle={ styles.declineButton }
                      title='DECLINE'
                      onPress={() => deleteUserRequest(request.id)}
                    />
                  </View>
                }
                {
                  status === 'accepted' && (
                    <Button
                      color='#02a4ff'
                      buttonStyle={ styles.chatButton }
                      title='CHAT'
                      onPress={() => this.props.navigation.navigate('Chat', { receivingUser: requester })}
                    />
                  )
                }
                </View>
              </View>
            );
          })
        }
        { !receivedRequests.length && <Text style={ styles.noRequests }>You currently have no requests.</Text>}
      </View>
      </ImageBackground>
    );
  }
}

const mapState = ({ user, users, userRequests }, { navigation }) => {
  const receivedRequests = userRequests.filter(request => request.responderId === user.id)
  const newRequestCount = userRequests.filter(request => request.responderId === user.id && request.status === 'pending').length
  return {
    user,
    users,
    receivedRequests,
    newRequestCount
  }
}

const mapDispatch = (dispatch) => {
  return {
    updateUserRequest: (userRequest) => dispatch(updateUserRequestOnServer(userRequest)),
    deleteUserRequest: (id) => dispatch(deleteUserRequestFromServer(id))
  }
}

export default connect(mapState, mapDispatch)(UserRequests);

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  requestContainer: {
    borderColor: '#fff',
    borderWidth: 1.5,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainer: {
    marginLeft: 10,
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoContainer: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  name: {
    marginTop: 10,
    fontSize: 25,
    color: '#fff'
  },
  acceptButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderTopColor: '#fff',
    borderRightColor: '#fff',
    borderBottomColor: '#fff',
    borderLeftColor: '#fff',
    borderRadius: 50,
    marginTop: 15,
    width: '100%'
  },
  declineButton: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderWidth: 1.5,
    borderTopColor: '#fff',
    borderRightColor: '#fff',
    borderBottomColor: '#fff',
    borderLeftColor: '#fff',
    borderRadius: 50,
    marginTop: 15,
    marginBottom: 15
  },
  chatButton: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderTopColor: '#fff',
    borderRightColor: '#fff',
    borderBottomColor: '#fff',
    borderLeftColor: '#fff',
    borderRadius: 50,
    marginTop: 15,
    width: '100%',
    marginBottom: 30
  },
  noRequests: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center'
  }
})
