import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Alert, ImageBackground } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { createDescriptionOnServer, updateDescriptionOnServer } from '../store';

class UserDescriptions extends Component {
  constructor(props) {
    super(props);
    const { orgForms, organization, user, descriptions } = props;
    const reducedForms = orgForms.reduce((memo, form) => {
      const description = descriptions.find(des => des.userId == user.id && des.organizationId === organization.id && des.formId === form.id)
      if(description) {
        memo[form.id] = description.description;
      } else {
        memo[form.id] = '';
      }
      return memo;
    }, {})
    this.state = reducedForms;
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(formId, input) {
    this.setState({ [formId]: input });
  }

  onSubmit() {
    const dynamicState = this.state;
    const { organization, user, descriptions, updateDescription, createDescription, orgForms, navigation } = this.props;
    const ownState = Object.keys(dynamicState);
    if(ownState.length !== orgForms.length) {
      Alert.alert('You must fill out all forms!');
      return;
    }
    ownState.forEach(stateItem => {
      const description = descriptions.find(des => des.userId == user.id && des.organizationId === organization.id && des.formId === stateItem)
      if(description) {
        updateDescription({
          id: description.id,
          userId: user.id,
          description: dynamicState[stateItem],
          organizationId: organization.id,
          formId: stateItem
        });
      } else {
        createDescription({
          userId: user.id,
          description: dynamicState[stateItem],
          organizationId: organization.id,
          formId: stateItem
        });
      }
    })
    if(ownState.length === orgForms.length) {
      const bool = ownState.map(item => {
        return !!dynamicState[item]
      })
      if(bool.includes(false)) {
        Alert.alert('You must fill out all forms!')
      } else {
        navigation.goBack();
      }
    }
  }

  render() {
    const { orgForms, descriptions, organization, user } = this.props;
    const { onChange, onSubmit, descriptionExists } = this;
    const ownState = this.state;
    return (
      <ImageBackground source={ require('../assets/images/bg.png') } style={{ height: '100%', width: '100%' }}>
        <View>
          {
            orgForms.map(form => {
              const description = descriptions.find(des => des.userId == user.id && des.organizationId === organization.id && des.formId === form.id)
              return (
                <View
                  style={ styles.container }
                  key={form.id}
                >
                  <Text style={ styles.name }>{form.name}</Text>
                  <TextInput
                    style={styles.input}
                    value={ownState[form.id]}
                    onChangeText={(ownState) => onChange(form.id, ownState)}
                  />
                </View>
              );
            })
          }
          <Button
            color='#fff'
            buttonStyle={ styles.button }
            title='Submit'
            onPress={ () => onSubmit() }
          />
        </View>
      </ImageBackground>
    );
  }
}

const mapState = ({ user, forms, descriptions }, { navigation }) => {
  const organization = navigation.getParam('organization', 'no organization');
  const orgForms = forms.filter(form => form.organizationId === organization.id);
  return {
    orgForms,
    organization,
    descriptions,
    user,
    navigation
  }
}

const mapDispatch = dispatch => {
  return {
    createDescription: (description) => dispatch(createDescriptionOnServer(description)),
    updateDescription: (description) => dispatch(updateDescriptionOnServer(description))
  }
}

export default connect(mapState, mapDispatch)(UserDescriptions);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  input: {
    color: '#fff',
    fontSize: 15,
    height: 40,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
    borderLeftColor: 'transparent',
    paddingHorizontal: 10,
    width: '90%'
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20
  },
  button: {
    marginTop: 20,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderBottomColor: '#fff',
    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    borderRightColor: '#fff',
    borderRadius: 50
  }
});
