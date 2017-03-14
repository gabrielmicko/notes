import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class Menu extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }
  render() {
    if(this.props.token !== false) {
      return (
        <ul>
          <li><Link to="/list">My notes</Link></li>
          <li><Link to="/add">Take a note</Link></li>
          <li><Link to="/logout">Logout</Link></li>
        </ul>
      )
    }
    else {
      return (
        <ul>
          <li><Link to="/login">Login</Link></li>
        </ul>
      )
    }
  }
}


Menu.propTypes = {
  token: PropTypes.any.isRequired
};

export default connect((state) => {
  return {
    token: state.token
  }
}
)(Menu)
