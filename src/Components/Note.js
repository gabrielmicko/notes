import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getNotes } from '../Helpers/api.js';
import { updateNote } from '../Actions/notes.js';
import _findIndex from 'lodash/findIndex';


class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0
    };
  }

  componentDidMount() {
    let id = parseFloat(this.props.params.id);
    let key = parseFloat(_findIndex(this.props.notes, {'id':id}));
    this.props.getNote(this.props.token, id);
    this.setState({
      key: key
    });
  }
  render() {
    let note = this.props.notes[this.state.key];
    return (
      <div className="note">
        <h1><strong>{note.title}</strong></h1>
        <h5><strong>Private:</strong> {(note.private === true) ? 'yes' : 'no'}</h5>
        <h5><strong>Created:</strong> {(note.createdAt || '')} <strong>Update:</strong> {(note.updatedAt || '')}</h5>
        <h3>
          {note.text}
        </h3>
      </div>
    );
  }
}

Note.propTypes = {
  getNote: PropTypes.func.isRequired,
};

const mapDispatchToProps = ((dispatch, state) => ({
  getNote: (token, id) => {
    getNotes(token, id, '', ['id', 'url', 'title', 'text', 'private', 'createdAt', 'updatedAt']).then((responseData) => {
      dispatch(updateNote(responseData.data.data.notes, id))
    });
  }
}));

export default connect((state) => {
  return {
    'token': state.token,
    'notes': state.notes,
  }
}, mapDispatchToProps
)(Note)
