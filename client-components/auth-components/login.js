import React from 'react';
import axios from 'axios';

import { Dimensions } from 'react-native';
import { Card, Button, Input, } from 'react-native-elements';

import IP from '../../IP';

//====================================================
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      wrongEmailOrPass: false,
    }
    this.submitLogin = this.submitLogin.bind(this);
  }
  //====================================================
  submitLogin() {
    if (this.state.email.length) {
      axios.post(`http://${IP}/api/login`, {
        email: this.state.email,
        password: this.state.password,
      }).then(results => {
        if (results.data === 'Wrong email or password') {
          this.setState({
            wrongEmailOrPass: true,
          });
        } else {
          let { email, name } = results.data;
          this.props.logIn(email, name);
        }
      }).catch(err => {
        console.error('Error in validating user login:', err);
      });
    }
  }
  //====================================================
  render() {
    return (
      <Card
        containerStyle={{
          width: 265,
          borderRadius: 20,
        }}>
        <Input
          placeholder='Email'
          onChangeText={text => this.setState({
            email: text,
            wrongEmailOrPass: false,
          })}
          inputStyle={{
            fontSize: 12
          }}
          inputContainerStyle={{
            borderWidth: 1,
            borderRadius: 20,
            height: 35,
            width: 200,
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 15
          }}
          leftIcon={{
            name: 'ios-mail',
            type: 'ionicon',
            color: 'lightgray'
          }}
        />
        <Input
          placeholder='Password'
          secureTextEntry={true}
          onChangeText={text => this.setState({
            password: text,
            wrongEmailOrPass: false,
          })}
          inputStyle={{
            fontSize: 12
          }}
          inputContainerStyle={{
            borderWidth: 1,
            borderRadius: 20,
            height: 35,
            width: 200,
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 15
          }}
          leftIcon={{
            name: 'ios-lock',
            type: 'ionicon',
            color: 'lightgrey'
          }}
        />
        <Button
          title='Log In'
          buttonStyle={{
            backgroundColor: 'dodgerblue',
            marginTop: 5,
            borderRadius: 20,
            height: 35,
            width: 200,
            marginLeft: 15,
          }}
          loading={this.props.loading}
          onPress={() => {
            this.props.toggleLoading()
            this.props.submitLogin(this.state.email, this.state.password);
          }}
        />
      </Card>
    )
  }
}

export default Login;
