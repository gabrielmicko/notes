import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { login } from '../Actions/login';
import { auth } from '../Helpers/api';
import {browserHistory} from 'react-router';


class Insert extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'form_username': '',
      'form_password': ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      ['form_' + name]: value
    });
  }
  shouldComponentUpdate(nextProps) {
    if(nextProps.token !== false) {
      browserHistory.push('/list');
      return false;
    }
    return true;
  }

  componentDidMount() {

  }
  handleSubmit(event) {
    event.preventDefault();
    this.props.login(this.state.form_username, this.state.form_password);
  }


  render() {
    return (
      <div>
        <h1>Login</h1>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form-element">
            <label>Username</label>
            <input type="text" name="username" value={this.state.form_username} onChange={this.handleInputChange} />
          </div>
          <div className="form-element">
            <label>Password</label>
            <input type="password" name="password" value={this.state.form_password} onChange={this.handleInputChange} />
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    );
  }
}

Insert.propTypes = {
  login: PropTypes.func.isRequired,
};

const mapDispatchToProps = ((dispatch, state) => ({
  login: (username, password) => {
    auth(username, password, ['id', 'token']).then((resp) => {
      if(resp.data.data.auth.length > 0) {
        let token = resp.data.data.auth[0].token;
        localStorage.setItem('token', token);
        dispatch(login(token));
      }
      else {
        alert('Login incorrect.');
      }
    })
  }
}));

export default connect((state) => {
  return {
    'token': state.token,
  }
}, mapDispatchToProps
)(Insert)
