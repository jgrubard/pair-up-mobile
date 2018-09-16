import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { createUserRequestOnServer } from '../store';

class UserList extends Component {

  render() {
    const { loggedUser, ownUsers, createRequest, userRequests, organization, navigation, ownForms, descriptions } = this.props;
    return (
      <View>
        <Text h4 style={ styles.header }>Checked-in Members</Text>
        {
          ownUsers.map(user => {
            const requestSent = userRequests.find(request => request.requesterId === loggedUser.id && request.responderId === user.id && request.organizationId === organization.id)
            const skillInfo = ownForms.reduce((skillSet, form) => {
              const description = descriptions.find(des => des.organizationId === organization.id && des.userId === user.id && des.formId === form.id)
              skillSet.push({ form: form.name, description: description.description})
              return skillSet;
            }, [])
            return (
              <View
                key={user.id}
                style={ styles.container }>
                <Text style={ styles.name }>{user.fullName}</Text>
                {
                  skillInfo.map(skill => {
                    return (
                      <Text key={skill.form} style={ styles.description }>{skill.form}: {skill.description}</Text>
                    );
                  })
                }
                {
                  !requestSent ? (
                    <Button
                      color='#fff'
                      onPress={() => createRequest({ requesterId: loggedUser.id, responderId: user.id, organizationId: organization.id })}
                      title='SEND REQUEST'
                      buttonStyle={ styles.requestButton }
                    />
                  ) :
                    requestSent && requestSent.status === 'pending' ? (
                      <Button
                        color='black'
                        onPress={() => console.log("Stop pressing this button! It doesn't work!")}
                        title='REQUEST SENT'
                        buttonStyle={ styles.requestSentButton }
                        disabled={ true }
                      />
                    )
                      : (
                        <Button
                          color='#fff'
                          onPress={() => navigation.navigate('Chat', { receivingUser: user })}
                          title='CHAT'
                          buttonStyle={ styles.chatButton }
                        />
                      )
                }
              </View>
            )
          })
        }
      </View>
    );
  }
}

const mapState = ({ user, users, userRequests, forms, descriptions }, { organization, navigation }) => {
  const ownUsers = users.filter(ownUser => ownUser.checkedInId === organization.id && ownUser.id !== user.id);
  const loggedUser = user;
  const ownForms = forms.filter(form => form.organizationId === organization.id)
  return {
    ownUsers,
    loggedUser,
    userRequests,
    organization,
    navigation,
    ownForms,
    descriptions
  }
}

const mapDispatch = (dispatch) => {
  return {
    createRequest: (request) => {
      dispatch(createUserRequestOnServer(request))
    }
  }
}

export default connect(mapState, mapDispatch)(UserList)

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    marginTop: 20
  },
  container: {
    padding: 20,
    margin: 10,
    justifyContent: 'center',
  },
  name: {
    textAlign: 'center',
    fontSize: 20,
    color: '#fff'
  },
  description: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16
  },
  requestButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 50,
    marginTop: 15
  },
  requestSentButton: {
    backgroundColor: 'gray',
    borderRadius: 50,
    marginTop: 15
  },
  chatButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#fff',
    borderRadius: 50,
    marginTop: 15
  }
})
