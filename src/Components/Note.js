import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getNotes, deleteNote } from '../Helpers/api.js';
import { updateNote } from '../Actions/notes.js';
import { browserHistory } from 'react-router';
import _findIndex from 'lodash/findIndex';
import { Converter } from 'showdown';

const converter = new Converter();

class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0
    };
    this.deleteNote = this.deleteNote.bind(this);
  }

  componentDidMount() {
    let id = parseFloat(this.props.params.id);
    let key = parseFloat(_findIndex(this.props.notes, { id: id }));
    this.props.getNote(this.props.token, id);
    this.setState({
      key: key,
      id: id
    });
  }

  deleteNote() {
    if (confirm('Would you like to delete this note?')) {
      this.props.deleteNote(this.props.token, this.state.id);
    }
  }

  render() {
    let key = parseFloat(_findIndex(this.props.notes, { id: this.state.id }));
    let note = this.props.notes[key];
    if (!note) {
      note = {
        id: 0,
        title: '',
        text: '',
        url: '',
        private: false,
        createdAt: '',
        updatedAt: ''
      };
    }

    const editButton = note => {
      if (this.props.token) {
        return <Link to={'/edit/' + note.id}>Edit</Link>;
      } else {
        return 'Edit';
      }
    };

    const deleteButton = note => {
      if (this.props.token) {
        return <Link onClick={this.deleteNote}>Delete</Link>;
      } else {
        return 'Delete';
      }
    };

    const createMDText = text => {
      return { __html: converter.makeHtml(text) };
    };
    return (
      <div className="note">
        <h1><strong>{note.title}</strong></h1>
        <table>
          <tbody>
            <tr>
              <td>Private</td>
              <td>{note.private === true ? 'yes' : 'no'}</td>
            </tr>
            <tr>
              <td>URL</td>
              <td>/note/{note.id + (note.url ? '/' + note.url : '')}</td>
            </tr>
            <tr>
              <td>Created</td>
              <td>{note.createdAt || ''}</td>
            </tr>
            <tr>
              <td>Updated</td>
              <td>{note.updatedAt || ''}</td>
            </tr>
            <tr>
              <td>Options</td>
              <td>{editButton(note)} | {deleteButton(note)}</td>
            </tr>
          </tbody>
        </table>
        <div
          className="text"
          dangerouslySetInnerHTML={createMDText(note.text)}
        />
      </div>
    );
  }
}

Note.propTypes = {
  getNote: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch, state) => ({
  getNote: (token, id) => {
    if (token == false) {
      token = '';
    }
    getNotes(token, id, '', [
      'id',
      'url',
      'title',
      'text',
      'private',
      'createdAt',
      'updatedAt'
    ]).then(responseData => {
      dispatch(updateNote(responseData.data.data.notes, id));
    });
  },
  deleteNote: (token, id) => {
    deleteNote(token, id, ['id']).then(responseData => {
      if (responseData.data.data.deleteNote.length) {
        browserHistory.push('/list');
      }
    });
  }
});

export default connect(
  state => {
    return {
      token: state.token,
      notes: state.notes
    };
  },
  mapDispatchToProps
)(Note);
