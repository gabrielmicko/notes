import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
/*
import { pushNote } from '../Actions/notes';
import { getNotes, editNote } from '../Helpers/api.js';
import { updateNote } from '../Actions/notes.js';
import _findIndex from 'lodash/findIndex';
import {browserHistory} from 'react-router';
*/

class Options extends React.Component {

 
  render() {
    return (
    	<div>
		    <nav>
		      <div className="option-list">
			      <ul>
				      <li><i className="fa fa-lock"></i></li>
				      <li><i className="fa fa-floppy-o"></i></li>
			      </ul>
		      </div>
	      </nav>
	    </div>
    );
  }
}

Options.propTypes = {

};

const mapStateToProps = (state) => {
	return {};
}

const mapDispatchToProps = dispatch => ({

});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Options);
