import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Editor from '../Components/Editor';
import Options from '../Components/Options';
import List from '../Components/List';

class Container extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  componentWillReceiveProps(newProps) {
    console.log('__');
    console.log(newProps);
  }

  render() {
    return (
      <div className="page container">
        <div className="site menu">
          <List router={this.props.router} params={this.props.router.params} />
        </div>
        <div className="site content">
          <Editor
            router={this.props.router}
            params={this.props.router.params}
          />
        </div>
        <div className="site access">
          <Options
            router={this.props.router}
            params={this.props.router.params}
          />
        </div>
      </div>
    );
  }
}

Container.propTypes = {};

const mapDispatchToProps = (dispatch, state) => ({});

export default connect(
  state => {
    return {
      notes: state.notes,
      token: state.token
    };
  },
  mapDispatchToProps
)(Container);
