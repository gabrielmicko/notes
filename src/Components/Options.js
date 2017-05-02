import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Login from './Login';
import _find from 'lodash/find';
import { updateNoteByProperty } from '../Actions/notes.js';
import { addLog } from '../Actions/settings.js';
import slugify from '../Helpers/slugify.js';
import {
  pushNote,
  removeNote,
  setNotes,
  setMasterNotes
} from '../Actions/notes';
import { getNotes, saveNotes } from '../Helpers/api.js';
/*
import { pushNote } from '../Actions/notes';
import { getNotes, editNote } from '../Helpers/api.js';
import { updateNote } from '../Actions/notes.js';
import _findIndex from 'lodash/findIndex';
import {browserHistory} from 'react-router';
*/

class Options extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      title: '',
      private: false,
      url: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.slugifyURL = this.slugifyURL.bind(this);
    this.handlePrivateChange = this.handlePrivateChange.bind(this);
    this.addNote = this.addNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.saveNotes = this.saveNotes.bind(this);
  }
  componentWillReceiveProps(newProps, nextProps) {
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
          private: note.private,
          url: note.url
        });
      }
    }
  }
  slugifyURL() {
    if (!this.props.token) {
      alert('Please log in.');
      return false;
    }
    const url = slugify(this.state.title);
    this.setState({
      url: url
    });
    this.props.updateNoteByPropertyHandler(this.state.id, 'url', url);
  }
  handleInputChange(event) {
    if (!this.props.token) {
      alert('Please log in.');
      return false;
    }
    const target = event.target;
    const value = target.value;
    this.setState({
      url: value
    });
    this.props.updateNoteByPropertyHandler(this.state.id, 'url', value);
  }

  handlePrivateChange(option) {
    if (!this.props.token) {
      alert('Please log in.');
      return false;
    }
    this.setState({
      private: option
    });
    this.props.updateNoteByPropertyHandler(this.state.id, 'private', option);
  }

  deleteNote() {
    if (!this.props.token) {
      alert('Please log in.');
      return false;
    }
    this.props.removeNote(this.state.id);
  }

  addNote() {
    if (!this.props.token) {
      alert('Please log in.');
      return false;
    }
    let ids = [];
    if (this.props.notes.length > 0) {
      ids = this.props.notes.map(note => {
        return parseFloat(note.id);
      });
    }

    let id = 0;
    if (ids.length > 0) {
      id = Math.max.apply(Math, ids);
    }

    this.props.addNote({
      id: id + 1,
      title: 'Hey, what a great title',
      text: 'This text is meant to be rewritten',
      url: 'new-note',
      private: false,
      createdAt: 'recently',
      updatedAt: 'recently',
      deleted: false
    });
  }

  saveNotes() {
    this.props.saveNotes(
      this.props.token,
      this.props.notes,
      this.props.masternotes
    );
  }

  render() {
    const lockBtn = !this.state.private
      ? <li>
          <i
            className="fa fa-unlock-alt"
            title="Make the note private"
            onClick={() => this.handlePrivateChange(true)}
          />
        </li>
      : <li>
          <i
            className="fa fa-lock"
            title="Make the note public"
            onClick={() => this.handlePrivateChange(false)}
          />
        </li>;

    const log = () => {
      if (this.props.log.length > 0) {
        return (
          <div className="box log">
            <h3 className="options">Log</h3>
            <ul>
              {this.props.log.map((log, key) => {
                return <li key={key}>{log}</li>;
              })}
            </ul>
          </div>
        );
      }
    };

    return (
      <div>
        <Login />
        <h3 className="options">Options</h3>
        <nav>
          <div className="option-list">
            <ul>
              {lockBtn}
              <li>
                <i
                  className="fa fa-trash-o"
                  title="Delete the note"
                  onClick={this.deleteNote}
                />
              </li>
              <li>
                <i
                  className="fa fa-plus"
                  title="Add a note"
                  onClick={this.addNote}
                />
              </li>
              <li>
                <i
                  onClick={this.saveNotes}
                  className="fa fa-floppy-o"
                  title="Save changes"
                />
              </li>
            </ul>
          </div>
        </nav>
        <div className="box">
          <h3 className="options">Set the URL</h3>
          <form className="form" onSubmit={this.handleSubmit}>
            <label>
              <i className="fa fa-anchor" />
              <i
                className="fa fa-lightbulb-o slugify"
                title="Slugify URL"
                onClick={this.slugifyURL}
              />
              <input
                type="text"
                name="username"
                className="slugify-input"
                value={this.state.url}
                onChange={this.handleInputChange}
              />
            </label>
          </form>
        </div>
        {log()}

      </div>
    );
  }
}

Options.propTypes = {
  updateNoteByPropertyHandler: PropTypes.func.isRequired,
  addNote: PropTypes.func.isRequired,
  removeNote: PropTypes.func.isRequired,
  saveNotes: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    token: state.token,
    notes: state.notes,
    masternotes: state.masternotes,
    log: state.settings.log
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateNoteByPropertyHandler: (id, property, value) => {
      dispatch(updateNoteByProperty(id, property, value));
    },
    addNote: note => {
      dispatch(pushNote(note));
    },
    removeNote: id => {
      dispatch(updateNoteByProperty(id, 'deleted', true));
    },
    saveNotes: (token, notes, masternotes) => {
      saveNotes(token, notes, masternotes).then(function(results) {
        let authError = false;
        results.forEach(result => {
          let resultObject = false;
          let method = '';
          if (result.data.data.editNote) {
            resultObject = result.data.data.editNote[0];
            method = 'Note has been saved';
          }
          if (result.data.data.addNote) {
            resultObject = result.data.data.addNote[0];
            method = 'Note has been added';
          }
          if (result.data.data.deleteNote) {
            resultObject = result.data.data.deleteNote[0];
            method = 'Note has been deleted';
          }
          if (resultObject && resultObject.id) {
            method += ' (' + resultObject.id + ').';
          }
          if (
            !resultObject ||
            (resultObject.length && resultObject.id === null)
          ) {
            authError = true;
          } else {
            dispatch(addLog(method));
          }
        });

        if (results.length) {
          if (authError === false) {
            getNotes(token, '', '', [
              'id',
              'url',
              'title',
              'text',
              'private',
              'deleted',
              'createdAt',
              'updatedAt'
            ]).then(responseData => {
              dispatch(setNotes(responseData.data.data.notes));
              dispatch(setMasterNotes(responseData.data.data.notes));
            });
          } else {
            dispatch(addLog('The token has expired.'));
          }
        } else {
          dispatch(addLog('Nothing to save.'));
        }
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Options);
