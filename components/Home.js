import React from 'react';
import { Text, View, ScrollView, Button, AsyncStorage, RefreshControl, StyleSheet, ImageBackground } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome'
import { getOrganizationsFromServer, getUserFromToken } from '../store';

class Home extends React.Component {
  static navigationOptions = {
    title: 'My Places',
    tabBarIcon: () => <Icon size={22} name='map-pin' color="#02a4ff" />
  }

  constructor() {
    super();
    this.state = { refreshing: false }
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentDidMount() {
    const { user, navigation } = this.props;
    if(!user.id) {
      navigation.navigate('Login');
    }
  }

  onRefresh() {
    const { getOrganizations } = this.props;
    this.setState({ refreshing: true })
    getOrganizations()
      .then(() => this.setState({ refreshing: false }))
  }

  render() {
    const { myOrgs } = this.props;
    const { navigate } = this.props.navigation;
    return (
      <ImageBackground source={ require('../assets/images/bg.png') } style={{ height: '100%', width: '100%' }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => this.onRefresh()}
          />
        }
      >
        <List
          containerStyle={ styles.list }
        >
          {
            myOrgs.map((organization) => (
              <ListItem
                roundAvatar
                avatar={{uri: organization.avatar || 'https://thesocietypages.org/socimages/files/2009/05/vimeo.jpg'}}
                containerStyle={ styles.listItem }
                title={organization.name}
                subtitle={organization.organization_type}
                key={ organization.id }
                onPress={() => navigate('Details', { organization })}
                chevronColor={ '#fff' }
                titleStyle={ styles.title }
                subtitleStyle={ styles.subtitle }
                avatarStyle={ styles.avatar }
              />
            ))
          }
        </List>
      </ScrollView>
      </ImageBackground>
    );
  }
}

const mapState = ({ userOrganizations, organizations, user }) => ({
  myOrgs: userOrganizations.reduce((array, userOrg) => {
    const organization = organizations.find(org => userOrg.userId === user.id && userOrg.organizationId === org.id);
    if(organization) {
      array.push(organization);
    }
    return array;
  }, []),
  user
});

const mapDispatch = dispatch => ({
  getOrganizations: () => dispatch(getOrganizationsFromServer()),
  getUser: (token) => dispatch(getUserFromToken(token))
});

export default connect(mapState, mapDispatch)(Home);

const styles = StyleSheet.create({
  list: {
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  listItem: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderBottomColor: '#fff',
    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    borderRightColor: '#fff',
    marginBottom: 5,
    paddingLeft: 15,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 20
  },
  subtitle: {
    color: 'black',
    marginLeft: 20
  },
  avatar: {
    height: 50,
    width: 50
  }
});
