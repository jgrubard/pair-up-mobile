import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';

export default class LoginForm extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {}
    };
    this.handleChange.bind = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validators = {
      email: value => {
        if(!value) return 'Email address is required.';
      },
      password: value => {
        if(!value) return 'Password is required.';
      }
    };
  }

  handleChange(name, value) {
    this.setState({ [name]: value });
  }

  handleSubmit() {
    const errors = Object.keys(this.validators).reduce((memo, key) => {
      const validator = this.validators[key];
      const value = this.state[key];
      const error = validator(value);
      if(error) {
        memo[key] = error;
      }
      return memo;
    }, {});
    this.setState({ errors });
    if(Object.keys(errors).length) {
      return;
    }
    this.props.login(this.state);
  }

  render() {
    const { errors } = this.state;
    return (
      <View>
        <Text style={ styles.error }>{ errors.email }</Text>
        <TextInput
          clearTextOnFocus={ true }
          onChangeText={ value => this.handleChange('email', value) }
          placeholder='Email Address'
          placeholderTextColor='rgba(255, 255, 255, 0.7)'
          returnKeyType='next'
          onSubmitEditing={ () => this.passwordInput.focus() }
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={ false }
          style={ styles.input }
        />
        <Text style={ styles.error }>{ errors.password }</Text>
        <TextInput
          clearTextOnFocus={ true }
          onChangeText={ value => this.handleChange('password', value) }
          onSubmitEditing={ this.handleSubmit }
          placeholder='Password'
          placeholderTextColor='rgba(255, 255, 255, 0.7)'
          returnKeyType='go'
          secureTextEntry
          autoCapitalize='none'
          style={ styles.input }
          ref={ input => this.passwordInput = input}
        />
        <TouchableOpacity
          style={ styles.buttonContainer }
          onPress={ this.handleSubmit }
        >
          <Text style={ styles.buttonText }>LOGIN</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    textAlign: 'center',
    marginBottom: 5,
    borderBottomColor: '#fff',
    borderTopColor: 'rgba(255, 255, 255, 0)',
    borderRightColor: 'rgba(255, 255, 255, 0)',
    borderLeftColor: 'rgba(255, 255, 255, 0)',
    borderWidth: 1,
    color: '#FFFFFF',
    paddingHorizontal: 10
  },
  buttonContainer: {
    backgroundColor: 'rgb(255, 255, 255)',
    borderWidth: 1.5,
    borderBottomColor: '#fff',
    borderTopColor: '#fff',
    borderRightColor: '#fff',
    borderLeftColor: '#fff',
    paddingVertical: 15,
    borderRadius: 50,
    marginBottom: 15,
    marginTop: 30
  },
  buttonText: {
    textAlign: 'center',
    color: '#02a4ff'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 5
  }
});
