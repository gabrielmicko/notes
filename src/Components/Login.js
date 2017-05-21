import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login, logout } from '../Actions/login';
import { setUsername } from '../Actions/settings';
import { auth } from '../Helpers/api';

class Insert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: false,
      authUsername: '',
      username: '',
      password: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      token: newProps.token,
      authUsername: newProps.authUsername
    });
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
    this.props.login(this.state.username, this.state.password);
  }
  handleLogout(event) {
    event.preventDefault();
    this.props.logout();
  }

  render() {
    const authBox = !this.state.token
      ? <form className="form" onSubmit={this.handleSubmit}>
          <label>
            <i className="fa fa-user" />
            <input
              placeholder="E-mail"
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleInputChange}
            />
          </label>
          <label>
            <i className="fa fa-key" />
            <input
              placeholder="Password"
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleInputChange}
            />
          </label>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      : <form className="form" onSubmit={this.handleLogout}>
          <div>
            <button type="submit">Logout</button>
          </div>
        </form>;

    return authBox;
  }
}

Insert.propTypes = {
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch, state) => ({
  login: (username, password) => {
    auth(username, password, ['id', 'token', 'username']).then(resp => {
      if (resp.data.data.auth.length > 0) {
        let token = resp.data.data.auth[0].token;
        let authUsername = resp.data.data.auth[0].username;
        localStorage.setItem('token', token);
        localStorage.setItem('username', authUsername);
        dispatch(login(token));
        dispatch(setUsername(username));
      } else {
        alert('Login incorrect.');
      }
    });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    dispatch(logout());
    dispatch(setUsername(''));
  }
});

export default connect(state => {
  return {
    token: state.token,
    authUsername: state.settings.username
  };
}, mapDispatchToProps)(Insert);
