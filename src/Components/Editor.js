import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
/*
import { pushNote } from '../Actions/notes';
import { getNotes, editNote } from '../Helpers/api.js';
import { updateNote } from '../Actions/notes.js';
import _findIndex from 'lodash/findIndex';
import {browserHistory} from 'react-router';
*/

class Editor extends React.Component {

 
  render() {
    return (
      <div className="ceh">
        <div className="content page fake-1"></div>
        <div className="content page fake-2"></div>
        <div className="content page real"></div>
      </div>
    );
  }
}

Editor.propTypes = {

};

const mapStateToProps = (state) => {
	return {};
}

const mapDispatchToProps = dispatch => ({

});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Editor);
