import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../Actions/login';
import { browserHistory } from 'react-router';

class Logout extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    // if (nextProps.token === false) {
    //   browserHistory.push('/login');
    //   return false;
    // }
    return true;
  }

  componentDidMount() {
    console.log('MOUNT');
    this.props.logout();
  }

  render() {
    return <div />;
  }
}

Logout.propTypes = {
  logout: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch, state) => ({
  logout: () => {
    localStorage.removeItem('token');
    dispatch(logout());
  }
});

export default connect(
  state => {
    return {
      token: state.token
    };
  },
  mapDispatchToProps
)(Logout);
