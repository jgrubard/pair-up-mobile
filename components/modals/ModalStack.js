import { createStackNavigator } from 'react-navigation';

import Login from './login/Login';
import SignUp from './signup/SignUp';

const ModalStack = createStackNavigator({
  Login: Login,
  SignUp: SignUp
}, {
  headerMode: 'none',
  mode: 'modal'
});

export default ModalStack;
