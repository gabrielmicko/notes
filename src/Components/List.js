import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getNotes } from '../Helpers/api.js';
import { setNotes } from '../Actions/notes.js';

class List extends React.Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.fetchAllNotes(this.props.token);
  }

  render() {

    const isPrivate = (bool) => {
      return (bool) ? <span>&#128274;, </span> : '';
    }
    const editButton = (note) => {
      if(this.props.token) {
        return (<Link to={'/edit/' + (note.id) }>Edit</Link>);
      }
    }
    return (
      <ul className="list">
        {
          this.props.notes.map(note => {
            return (
              <li key={note.id}>
                <h3>
                <Link to={'/note/' + (note.id) + ((note.title) ? ('/' + encodeURIComponent(note.title)) : '')}>{note.title}</Link> ({isPrivate(note.private)}{note.updatedAt})
                { editButton(note) }
                </h3>
              </li>
            )
          })
        }
      </ul>
    );
  }
}

List.propTypes = {
  fetchAllNotes: PropTypes.func.isRequired,
  token: PropTypes.any.isRequired,
};

const mapDispatchToProps = ((dispatch, state) => ({
  fetchAllNotes: (token) => {
    getNotes(token, '', '', ['id', 'title', 'private', 'updatedAt']).then((responseData) => {
      dispatch(setNotes(responseData.data.data.notes))
    });
  }
}));

export default connect((state) => {
  return {
    'notes': state.notes,
    'token': state.token,
  }
}, mapDispatchToProps
)(List)
