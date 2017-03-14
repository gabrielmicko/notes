import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushNote } from '../Actions/notes';
import { getNotes, editNote } from '../Helpers/api.js';
import { updateNote } from '../Actions/notes.js';
import _findIndex from 'lodash/findIndex';
import {browserHistory} from 'react-router';

class Edit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'formEmpty': true,
      'form_url': '',
      'form_title': '',
      'form_text': '',
      'form_private': false,
      'key': 0
    };


    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    let id = parseFloat(this.props.params.id);
    let key = parseFloat(_findIndex(this.props.notes, {'id':id}));
    this.props.getNote(this.props.token, id);
    this.setState({
      key: key
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.addNote(
      this.props.token,
      this.state.form_url,
      this.state.form_title,
      this.state.form_text,
      this.state.form_private
    );
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? (target.checked || false) : target.value;
    const name = target.name;
    let formData = [...[this.props.notes[this.state.key]]];
    formData[0][name] = value;
    this.props.saveNoteToStore(formData, formData[0]['id']);
  }

  render() {
    let note = this.props.notes[this.state.key];
    return (
      <div>
        <h1>Edit a note</h1>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form-element">
            <label>URL</label>
            <input name="url" value={note.url} onChange={this.handleInputChange} type="text" />
          </div>
          <div className="form-element">
            <label>Title</label>
            <input required="required" name="title" value={note.title} onChange={this.handleInputChange} type="text" />
          </div>
          <div className="form-element">
            <label>Note</label>
            <textarea required="required" name="text" value={note.text} onChange={this.handleInputChange} />
          </div>
          <div className="form-element">
            <label>Private</label>
            <input type="checkbox" checked={note.private} name="private" onChange={this.handleInputChange} />
          </div>
          <div>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    );
  }
}

Edit.propTypes = {
  editNote: PropTypes.func.isRequired,
  getNote: PropTypes.func.isRequired,
  saveNoteToStore: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    'token': state.token,
    'notes': state.notes
  }
}

const mapDispatchToProps = dispatch => ({
  editNote: (token, url, title, text, pvt) => {
  },
  saveNoteToStore: (note, id) => {
    dispatch(updateNote(note, id));
  },
  getNote: (token, id) => {
    getNotes(token, id, '', ['id', 'url', 'title', 'text', 'private', 'createdAt', 'updatedAt']).then((responseData) => {
      dispatch(updateNote(responseData.data.data.notes, id))
    });
  }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Edit);
