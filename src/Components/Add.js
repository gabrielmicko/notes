import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addNote } from '../Helpers/api';
import { pushNote } from '../Actions/notes';

import {browserHistory} from 'react-router';
console.log(addNote);
class Insert extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'form_url': '',
      'form_title': '',
      'form_text': '',
      'form_private': false
    };


    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    console.log(this.props);
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

    this.setState({
      ['form_' + name]: value
    });
  }

  render() {
    return (
      <div>
        <h1>Take a note</h1>
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form-element">
            <label>URL</label>
            <input name="url" value={this.state.form_url} onChange={this.handleInputChange} type="text" />
          </div>
          <div className="form-element">
            <label>Title</label>
            <input required="required" name="title" value={this.state.form_title} onChange={this.handleInputChange} type="text" />
          </div>
          <div className="form-element">
            <label>Note</label>
            <textarea required="required" name="text" value={this.state.form_text} onChange={this.handleInputChange} />
          </div>
          <div className="form-element">
            <label>Private</label>
            <input type="checkbox" checked={this.state.form_private} name="private" onChange={this.handleInputChange} />
          </div>
          <div>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    );
  }
}

Insert.propTypes = {
  addNote: PropTypes.func.isRequired
};


const mapStateToProps = (state) => {
  return {
    'token': state.token
  }
}

const mapDispatchToProps = dispatch => ({
  addNote: (token, url, title, text, pvt) => {
    console.log('AN');
    console.log(addNote);
    addNote(token, url, title, text, pvt, ['id', 'url', 'title', 'text', 'private', 'updatedAt', 'createdAt']).then((response) => {
      if(response.data.data.addNote.length > 0) {
        let id = response.data.data.addNote[0].id;
        let url = response.data.data.addNote[0].url;
        if(url) {
          url = '/' + url;
        }
        dispatch(pushNote(response.data.data.addNote));
        browserHistory.push('/note/' + id + url);
      }
      else {
        alert('Save failed');
      }
    });
  }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Insert);
