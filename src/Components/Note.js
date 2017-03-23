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
    
    const editButton = (note) => {
      if(this.props.token) {
        return (<Link to={'/edit/' + (note.id) }>Edit</Link>);
      }
    };
    
    const deleteButton = (note) => {
      if(this.props.token) {
        return (<Link onClick={this.deleteNote}>Delete</Link>);
      }
    };
    
    return (
      <div className="note">
        <h1><strong>{note.title}</strong></h1>
        <table>
          <tr>
            <td>Private</td>
            <td>{(note.private === true) ? 'yes' : 'no'}</td>
          </tr>
          <tr>
            <td>URL</td>
            <td>/note/{(note.id) + ((note.url) ? ('/' + note.url) : '')}</td>
          </tr>
          <tr>
            <td>Created</td>
            <td>{(note.createdAt || '')}</td>
          </tr>
          <tr>
            <td>Updated</td>
            <td>{(note.updatedAt || '')}</td>
          </tr>
          <tr>
            <td>Options</td>
            <td>{editButton(note)} | {deleteButton(note)}</td>
          </tr>
        </table>
        <div className="text">
          {note.text}
        </div>
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
