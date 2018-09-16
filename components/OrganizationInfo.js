import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, ScrollView, Image, RefreshControl, Alert, ImageBackground } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { createOrganizationRequestOnServer, getOrganizationRequestsFromServer, updateUserOnServer, updateLoggedUser, getUsersFromServer, getOrganizationsFromServer } from '../store';

import UserList from './UserList';

class OrganizationInfo extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('organization').name
    }
  }

  constructor() {
    super();
    this.state = {
      refreshing: false,
    }
    this.onRefresh = this.onRefresh.bind(this);
    this.checkInUser = this.checkInUser.bind(this);
    this.checkOutUser = this.checkOutUser.bind(this);
  }

  componentDidMount() {
    this.props.loadUsers()
  }

  onRefresh() {
    const { loadOrganizationsRequests, loadUsers, loadOrganizations } = this.props;
    this.setState({ refreshing: true })
    loadOrganizationsRequests()
      .then(() => loadUsers())
      .then(() => this.setState({ refreshing: false }))
  }

  checkInUser(user, organization) {
    const { updateUser, descriptionConfirm, ownRequest } = this.props;
    const { id, firstName, lastName, email, password, userStatus } = user;
    if (!descriptionConfirm && ownRequest && ownRequest.status === 'accepted') {
      return Alert.alert('Please fill out your stats before checking in!');
    }
    const updatedUser = { id, firstName, lastName, email, password, userStatus, checkedInId: organization.id }
    updateUser(updatedUser);
  }

  checkOutUser(user) {
    const { updateUser } = this.props;
    const { id, firstName, lastName, email, password, userStatus } = user;
    const updatedUser = { id, firstName, lastName, email, password, userStatus, checkedInId: null }
    updateUser(updatedUser);
  }

  render() {
    const { user, organization, ownRequest, createOrganizationRequest, organizationRequests, descriptionConfirm, checkedIn } = this.props;
    const { onRefresh, checkInUser, checkOutUser } = this;
    return (
      <ScrollView
        style={{ backgroundColor: organization.backgroundColor }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => onRefresh()}
          />
        }
      >
        <View style={styles.container}>
          <Text h3 style={[ styles.text, { color: organization.textColor } ]}>
            {organization.name}
          </Text>
          <Text style={[ styles.text, { marginBottom: 20, color: organization.textColor } ]}>
            ({organization.organization_type})
          </Text>
          <Text style={[ styles.text, { fontSize: 20, color: organization.textColor} ]}>
            {organization.contact_phone}
          </Text>
          <Text style={[ styles.text, { color: organization.textColor } ]}>
            {organization.address}
          </Text>
          <Text style={[ styles.text, { color: organization.textColor } ]}>
            {organization.city}, {organization.state} {organization.zip}
          </Text>
          <View style={styles.image}>
          {
            organization.image && (
              <Image
                style={{ height: 200, left: 0, right: 0, marginTop: 5 }}
                source={{ uri: organization.image }}
              />
            )
          }
        </View>
          {
            !ownRequest && (
              <Button
                color='#02a4ff'
                buttonStyle={ styles.join }
                title='Request to Join'
                onPress={() => {
                  createOrganizationRequest({ userId: user.id, organizationId: organization.id })
                }}
              />
            )
          }
          {
            ownRequest && ownRequest.status === 'pending' && (
              <Button
                color='#000'
                buttonStyle={ styles.pending }
                title='Request Pending'
                onPress={() => console.log('this should not click')}
                disabled={true}
              />
            )
          }
          {
            ownRequest && ownRequest.status === 'accepted' && !user.checkedInId && (
                <Button
                  color='#02a4ff'
                  buttonStyle={ styles.checkIn }
                  title='Check In'
                  onPress={() => checkInUser(user, organization)}
                />
            )
          }
          {
            ownRequest && ownRequest.status === 'accepted' && user.checkedInId && (
                <Button
                  color='#fff'
                  buttonStyle={ styles.checkOut }
                  title='Check Out'
                  onPress={() => checkOutUser(user)}
                />
            )
          }
          {
            ownRequest && ownRequest.status === 'accepted' && (
              <Button
                color='#fff'
                buttonStyle={ styles.stats }
                title={!descriptionConfirm ? 'Add Stats' : 'Edit Stats'}
                onPress={() => this.props.navigation.navigate('Descriptions', { organization })}
              />
            )
          }
          { user.checkedInId && user.checkedInId === organization.id && <UserList organization={organization} navigation={ this.props.navigation } /> }
        </View>
      </ScrollView>
    );
  }
}

const mapState = ({ organizationRequests, user, forms, descriptions }, { navigation }) => {
  const organization = navigation.getParam('organization', 'no organization');
  const ownRequest = organizationRequests.find(request => {
    return request.userId === user.id && request.organizationId === organization.id
  })
  const ownForms = forms.filter(form => form.organizationId === organization.id)
  const boolFormDescriptions = ownForms.map(form => {
    const description = descriptions.find(des => des.userId === user.id && des.formId === form.id)
    if(description && description.description) {
      return true;
    } else {
      return false;
    }
  });
  const descriptionConfirm = !boolFormDescriptions.includes(false)
  const checkedIn = !!user.checkedInId
  return {
    user,
    ownRequest,
    organization,
    organizationRequests,
    descriptionConfirm,
    checkedIn
  }
}

const mapDispatch = dispatch => {
  return {
    loadOrganizationsRequests: () => dispatch(getOrganizationRequestsFromServer()),
    createOrganizationRequest: (organizationRequest) => dispatch(createOrganizationRequestOnServer(organizationRequest)),
    updateUser: (user) => {
      dispatch(updateUserOnServer(user))
      dispatch(updateLoggedUser(user))
    },
    loadUsers: () => dispatch(getUsersFromServer()),
    loadOrganizations: () => dispatch(getOrganizationsFromServer())
  }
}

export default connect(mapState, mapDispatch)(OrganizationInfo);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  image: {
    flex: 1
  },
  text: {
    textAlign: 'left',
    color: 'white'
  },
  join: {
    backgroundColor: '#fff',
    borderRadius: 50,
    marginTop: 15
  },
  pending: {
    backgroundColor: 'grey',
    borderRadius: 50,
    marginTop: 15
  },
  checkIn: {
    backgroundColor: '#fff',
    borderRadius: 50,
    marginTop: 15
  },
  checkOut: {
    backgroundColor: 'red',
    borderRadius: 50,
    marginTop: 15
  },
  stats: {
    backgroundColor: 'steelblue',
    borderRadius: 50,
    marginTop: 15
  }
});
