import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _find from 'lodash/find';
import _debounce from 'lodash/debounce';
import { updateNoteByProperty } from '../Actions/notes.js';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      title: '',
      text: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentDidMount() {}
  componentWillReceiveProps(newProps) {
    if (newProps.notes.length > 0) {
      let note = newProps.notes[0];
      if (newProps.params.id) {
        note = _find(newProps.notes, {
          id: parseFloat(newProps.params.id)
        });
      }
      if (note) {
        this.setState({
          id: note.id,
          title: note.title,
          text: note.text
        });
      }
    }
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox'
      ? target.checked || false
      : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
    this.props.updateNoteByPropertyHandler(this.state.id, name, value);
  }
  render() {
    return (
      <div className="ceh">
        <div className="content page fake-1" />
        <div className="content page fake-2" />
        <div className="content page real">
          <header>
            <input
              type="text"
              name="title"
              value={this.state.title || ''}
              onChange={this.handleInputChange}
            />
          </header>
          <textarea
            name="text"
            value={this.state.text || ''}
            onChange={this.handleInputChange}
          />
        </div>
      </div>
    );
  }
}

Editor.propTypes = {
  token: PropTypes.any.isRequired
};
const mapStateToProps = state => {
  return {
    token: state.token,
    notes: state.notes
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateNoteByPropertyHandler: (id, property, value) => {
      dispatch(updateNoteByProperty(id, property, value));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
