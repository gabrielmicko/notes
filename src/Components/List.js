import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getNotes } from '../Helpers/api.js';
import { setNotes, setMasterNotes } from '../Actions/notes.js';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: false
    };
  }
  componentDidMount() {
    console.log('LF');
    this.props.fetchAllNotes(this.props.token);
  }

  componentWillReceiveProps(newProps) {
    if (this.state.token !== newProps.token) {
      this.setState({
        token: newProps.token
      });
      this.props.fetchAllNotes(newProps.token);
    }
  }

  render() {
    const isPrivate = function(isPrivate) {
      if (isPrivate) {
        return <i className="fa fa-lock" />;
      } else {
        return <i className="fa fa-unlock-alt" />;
      }
    };

    const isPrivateClass = function(isPrivate) {
      if (isPrivate) {
        return 'private';
      } else {
        return '';
      }
    };
    let notDeletedNotes = 0;
    const noteList = this.props.notes.map((note, key) => {
      if (note.deleted) return;
      ++notDeletedNotes;
      return (
        <li key={key} className={isPrivateClass(note.private)}>
          <Link
            to={
              '/note/' +
                note.id +
                (note.url ? '/' + encodeURIComponent(note.url) : '')
            }
          >
            {note.title}
          </Link>
          <div className="info">
            <i className="fa fa-clock-o" />
            {' '}
            {note.updatedAt}
            {', '}
            {isPrivate(note.private)}
          </div>
        </li>
      );
    });

    const noList = (
      <div className="nothing-here">There is nothing here yet.</div>
    );
    console.log(notDeletedNotes);
    console.log(this.props.notes.length);
    const listItem = notDeletedNotes === 0
      ? noList
      : <ul className="note-list">{noteList}</ul>;

    return (
      <div className="option-holder">
        <div className="note-list-holder">
          {listItem}
        </div>
      </div>
    );
  }
}

List.propTypes = {
  fetchAllNotes: PropTypes.func.isRequired,
  token: PropTypes.any.isRequired
};

const mapDispatchToProps = (dispatch, state) => ({
  fetchAllNotes: token => {
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
  }
});

export default connect(state => {
  return {
    notes: state.notes,
    token: state.token
  };
}, mapDispatchToProps)(List);
