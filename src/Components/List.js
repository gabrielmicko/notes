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
    const isPrivate = function(isPrivate) {
      if(isPrivate) {
        return (<i className="fa fa-lock"></i>)
      }
      else {
        return (<i className="fa fa-unlock-alt"></i>)
      }
    };
    return (
        <div className="option-holder">
          <div className="note-list-holder">
            <ul className="note-list">
              {
                this.props.notes.map((note, key) => {
                  return (
                    <li key={key}>
                      <Link to={'/note/' + (note.id) + ((note.url) ? ('/' + encodeURIComponent(note.url)) : '')}>{note.title}</Link>
                      <div className="info"><i className="fa fa-clock-o"></i> {note.updatedAt}, {isPrivate(note.private)}</div>
                      
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
    );
  }
}

List.propTypes = {
  fetchAllNotes: PropTypes.func.isRequired,
  token: PropTypes.any.isRequired,
};

const mapDispatchToProps = ((dispatch, state) => ({
  fetchAllNotes: (token) => {
    getNotes(token, '', '', ['id', 'url', 'title', 'private', 'updatedAt']).then((responseData) => {
      dispatch(setNotes(responseData.data.data.notes))
    });
  },
}));

export default connect((state) => {
  return {
    'notes': state.notes,
    'token': state.token,
  }
}, mapDispatchToProps
)(List)
