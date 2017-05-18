import React from 'react';
import { connect } from 'react-redux';
import { setSearch } from '../Actions/settings.js';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.props.setSearch(event.target.value);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      searchValue: newProps.searchValue
    });
  }

  render() {
    return (
      <div className="search box">
        <i className="fa fa-search" />
        <input
          value={this.state.value}
          onChange={this.handleInputChange}
          placeholder="Search for notes"
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    searchValue: state.settings.search
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setSearch: searchValue => {
      dispatch(setSearch(searchValue));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
