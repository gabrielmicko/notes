import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login, logout } from '../Actions/login';
import { setUsername, setBoxState, addLog } from '../Actions/settings';
import { auth, registerUser } from '../Helpers/api';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      password2: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    //this.setState({});
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  componentDidMount() {}

  handleSubmit(event) {
    event.preventDefault();

    this.props.register(
      this.state.username,
      this.state.password,
      this.state.password2
    );
  }

  render() {
    const registerForm = (
      <form className="form" onSubmit={this.handleSubmit}>
        <label>
          <i className="fa fa-user" />
          <input
            type="text"
            name="username"
            placeholder="E-mail"
            value={this.state.email}
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          <i className="fa fa-key" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          <i className="fa fa-key" />
          <input
            type="password"
            name="password2"
            placeholder="Password again"
            value={this.state.password2}
            onChange={this.handleInputChange}
          />
        </label>
        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    );

    return registerForm;
  }
}

Register.propTypes = {
  register: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch, state) => ({
  register: (email, password, password2) => {
    if (
      email.length > 3 &&
      password.length > 3 &&
      password2.length > 3 &&
      password == password2
    ) {
      registerUser(email, password, ['id', 'username']).then(resp => {
        if (resp.data.errors) {
          dispatch(addLog(resp.data.errors[0].message));
        } else if (resp.data.data.registerUser.length === 0) {
          dispatch(addLog('The email or password got refused.'));
        } else {
          dispatch(addLog('Successfully registered.'));
          dispatch(setBoxState('login'));
        }
      });
    } else {
      dispatch(addLog('The given data is incorrect.'));
    }
  }
});

export default connect(state => {
  return {
    // token: state.token,
    // authUsername: state.settings.username
  };
}, mapDispatchToProps)(Register);
