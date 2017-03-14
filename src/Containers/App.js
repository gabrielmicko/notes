import Menu from '../Components/Menu';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { login } from '../Actions/login';

class App extends React.Component {
  componentDidMount() {
    this.props.boot();
  }
  render() {
    return (
      <div className="page">
        <h1>Notes</h1>
        <Menu />
        { this.props.children }
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  boot: PropTypes.func.isRequired,
};

const mapDispatchToProps = ((dispatch, state) => ({
  boot: () => {
    let token = localStorage.getItem('token');
    dispatch(login((token || false)));
  }
}));

export default connect((state) => {
  return {}
}, mapDispatchToProps
)(App)
