import React from 'react';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Asset, AppLoading } from 'expo';
import { getOrganizationsFromServer, getUserFromToken, getUserOrganizationsFromServer, getUsersFromServer, getUserRequestsFromServer, getOrganizationRequestsFromServer, getFormsFromServer, getDescriptionsFromServer, logOut } from '../store';
import Icon from 'react-native-vector-icons/FontAwesome'
import Home from './Home.js';
import OrganizationInfo from './OrganizationInfo';
import UserRequests from './UserRequests';
import ModalStack from './modals/ModalStack';
import UserDescriptions from './UserDescriptions';
import UserProfile from './UserProfile';
import Chat from './Chat';
import SearchMap from './SearchMap';

const TabNavigator = createMaterialBottomTabNavigator({
  'My Orgs': {
    screen: Home
  },
  "Pair Requests": {
    screen: UserRequests,
  },
  Find: {
    tabBarLabel: 'Search',
    screen: SearchMap,
  }
}, {
  initialRouteName: 'My Orgs',
  activeTintColor: '#02a4ff',
  inactiveTintColor: '#005d91',
  barStyle: {
    backgroundColor: '#b6d8ed',
    alignItems: 'center'
  }
});

const NavStack = createStackNavigator({
  Home: {
    screen: TabNavigator,
    navigationOptions: ({ navigation} ) => ({
      title: 'Pair Up!',
      headerRight: (
        <Icon
          size={22}
          name='gear'
          color="#02a4ff"
          style={{ marginRight: 20 }}
          onPress={ () => navigation.navigate('UserProfile')}
        />
      )
    })
  },
  Details: OrganizationInfo,
  Descriptions: UserDescriptions,
  Chat: Chat,
  UserProfile: UserProfile
}, {
  headerMode: 'screen',
  initialRouteName: 'Home',
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#b6d8ed',
    }
  }
});

const RootStack = createStackNavigator({
  Modals: ModalStack,
  Nav: NavStack
}, {
  initialRouteName: 'Nav',
  headerMode: 'none',
});

class MainStack extends React.Component {
  constructor() {
    super();
    this.state = {
      ready: false
    };
    this.asyncLoad = this.asyncLoad.bind(this);
    this.loadApp = this.loadApp.bind(this);
  }

  asyncLoad() {
    const { getUser, getOrganizations, getUserOrganizations, getUsers, getUserRequests, getOrgRequests, getForms, getDescriptions } = this.props;
    return Promise.all([
      AsyncStorage.getItem('token')
        .then(token => {
          if (token) {
            return getUser(token);
          }
        }),
      getOrganizations(),
      getUsers(),
      getUserOrganizations(),
      getUserRequests(),
      getOrgRequests(),
      getForms(),
      getDescriptions(),
      Asset.fromModule(require('../assets/images/logo.png')).downloadAsync(),
      Asset.fromModule(require('../assets/images/bg.png')).downloadAsync()
    ]);
  }

  loadApp() {
    this.setState({ ready: true });
  }

  render() {
    if(!this.state.ready) {
      return (
        <AppLoading
          startAsync={ this.asyncLoad }
          onFinish={ this.loadApp }
          onError={ console.warn }
        />
      );
    }
    return (
      <RootStack screenProps={{ requestCount: this.props.requestCount }} />
    );
  }
}

const mapState = ({ user, userRequests }) => {
  const requestCount = userRequests.reduce((memo, request) => {
    if(request.responderId === user.id && request.status === 'pending') {
      memo++;
    }
    return memo;
  }, 0)
  return {
    requestCount
  }
};

const mapDispatch = dispatch => ({
  getOrganizations() {
    dispatch(getOrganizationsFromServer());
  },
  getUser(token) {
    return dispatch(getUserFromToken(token));
  },
  getUserOrganizations: () => dispatch(getUserOrganizationsFromServer()),
  getUsers: () => dispatch(getUsersFromServer()),
  getUserRequests: () => dispatch(getUserRequestsFromServer()),
  getOrgRequests: () => dispatch(getOrganizationRequestsFromServer()),
  getForms: () => dispatch(getFormsFromServer()),
  getDescriptions: () => dispatch(getDescriptionsFromServer())
});

export default connect(mapState, mapDispatch)(MainStack);
