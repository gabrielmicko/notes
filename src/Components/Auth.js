import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login, logout } from '../Actions/login';
import { setUsername, setBoxState } from '../Actions/settings';
import { auth } from '../Helpers/api';
import Login from './Login';
import Register from './Register';

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boxState: 'login',
      token: false,
      authUsername: ''
    };
  }

  switchBox(boxState) {
    this.props.setBoxState(boxState);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      token: newProps.token,
      authUsername: newProps.authUsername,
      boxState: newProps.boxState
    });
  }
  render() {
    const authMenu = !this.state.token
      ? <ul className="auth-options">
          <li>
            <div
              onClick={() => {
                this.switchBox('login');
              }}
            >
              Login
            </div>
          </li>
          <li>
            <div
              onClick={() => {
                this.switchBox('register');
              }}
            >
              Register
            </div>
          </li>
        </ul>
      : '';

    const authBox = () => {
      if (this.state.boxState === 'register' && !this.state.token) {
        return <Register />;
      } else {
        return <Login />;
      }
    };

    const authText = () => {
      if (this.state.boxState === 'register' && !this.state.token) {
        return <h3>Register</h3>;
      } else if (this.state.token) {
        return <h3>Welcome <strong>{this.state.authUsername}</strong>!</h3>;
      } else {
        return <h3>Authentication</h3>;
      }
    };

    return (
      <div className="box">
        {authMenu}
        {authText()}
        {authBox()}
      </div>
    );
  }
}

Auth.propTypes = {
  setBoxState: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch, state) => ({
  setBoxState: boxState => {
    dispatch(setBoxState(boxState));
  }
});

export default connect(state => {
  return {
    token: state.token,
    authUsername: state.settings.username,
    boxState: state.settings.boxState
  };
}, mapDispatchToProps)(Auth);
