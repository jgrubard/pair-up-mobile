import React from 'react';
import { Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import MapView, { Marker, Callout } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome'

class SearchMap extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Search',
    tabBarIcon: () => <Icon size={22} name='search' color="#02a4ff" />
  }

  constructor() {
    super();
    this.state = {
      search: '',
      searchList: [],
      coordinates: {
        latitude: 40.705076,
        longitude: -74.009160,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.zoomToMarker = this.zoomToMarker.bind(this);
  }

  handleChange(value) {
    this.setState({ search: value });
    this.search(value);
  }

  search(value) {
    const { organizations } = this.props;
    const searchList = organizations.filter(org => org.name.toLowerCase().startsWith(value.toLowerCase()));
    if(value) {
      this.setState({ searchList });
    } else {
      this.setState({ searchList: [] });
    }
  }

  zoomToMarker(longitude, latitude) {
    this.setState({
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
        latitudeDelta: 0.002,
        longitudeDelta: 0.002
      },
      search: '',
      searchList: []
    });
  }

  render() {
    const { organizations } = this.props;
    const { navigate } = this.props.navigation;
    const { search, searchList, coordinates } = this.state;

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={ coordinates }>
          {organizations.map((organization) => {
            const latitude = Number(organization.latitude);
            const longitude = Number(organization.longitude);
            const id = organization.id;
            return (
              <Marker
                key={id}
                coordinate={{
                  latitude: latitude,
                  longitude: longitude
                }}
              >
                <Callout onPress={() => navigate('Details', { organization })} style={ styles.callout }>
                  <Text style={ styles.calloutText }>{organization.name}</Text>
                </Callout>
              </Marker>
            );
          }
          )}
        </MapView>
        <View style={ styles.searchContainer }>
          <View>
            <TextInput
              clearTextOnFocus={ true }
              placeholder='Search...'
              style={ styles.search }
              value={ search }
              onChangeText={ value => this.handleChange(value) }
            />
          </View>
          <View style={ styles.listContainer }>
            <FlatList
              data={ searchList }
              renderItem={ ({ item }) => ListItem(item, this.zoomToMarker) }
              keyExtractor={ (item) => item.id }
              o
            />
          </View>
        </View>
      </View>
    );
  }
}

const ListItem = (item, zoom) => {
  return (
    <View>
      <TouchableOpacity
        onPress={ () => zoom(item.longitude, item.latitude) }
        style={ styles.itemContainer}
      >
        <Text style={ styles.itemText }>
          { item.name }&nbsp;
        </Text>
        <Text style={ styles.itemSubtitle }>
          ({ item.organization_type })
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  radius: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 112, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  marker: {
    height: 20,
    width: 20,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 20 / 2,
    overflow: 'hidden',
    backgroundColor: '#007AFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  map: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute'
  },
  callout: {
    height: 50,
    width: 100,
    backgroundColor: '#02A4FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  calloutText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold'
  },
  searchContainer: {
    width: 350,
    position: 'absolute',
    top: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25
  },
  search: {
    width: 350,
    height: 40,
    backgroundColor: 'rgb(255, 255, 255)',
    borderWidth: 1,
    borderColor: '#000',
    paddingLeft: 15,
  },
  listContainer: {
    marginTop: 10
  },
  itemContainer: {
    width: 350,
    height: 40,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 50
  },
  itemText: {
    fontSize: 15,
    color: 'black'
  },
  itemSubtitle: {
    fontSize: 12,
    color: 'black'
  }
});

const mapState = ({ organizations, user }) => ({
  organizations, user
});

const mapDispatch = null;

export default connect(mapState, mapDispatch)(SearchMap);
