import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../Actions/login';
import { setUsername } from '../Actions/settings';
import DocumentTitle from 'react-document-title';

class App extends React.Component {
  componentDidMount() {
    this.props.boot();
  }
  render() {
    return (
      <DocumentTitle title="Notes">
        {this.props.children}
      </DocumentTitle>
    );
  }
}

App.propTypes = {
  boot: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch, state) => ({
  boot: () => {
    let token = localStorage.getItem('token');
    let username = localStorage.getItem('username');
    dispatch(login(token || false));
    dispatch(setUsername(username || false));
  }
});

export default connect(
  state => {
    return {};
  },
  mapDispatchToProps
)(App);
