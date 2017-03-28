import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { login } from '../Actions/login';
import DocumentTitle  from 'react-document-title';
import List from '../Components/List';
import Editor from '../Components/Editor';
import Options from '../Components/Options';


class App extends React.Component {
  componentDidMount() {
    this.props.boot();
  }
  render() {
    return (
       <DocumentTitle title='Notes'>
         <div className="page container">
           <div className="site menu">
             <List />
           </div>
           <div className="site content">
             <Editor />
           </div>
           <div className="site access">
             <Options/>
           </div>
         </div>
      </DocumentTitle>
    );
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  boot: PropTypes.func.isRequired,
};

const mapDispatchToProps = ((dispatch, state) => ({
  boot: () => {
    let token = localStorage.getItem('token');
    dispatch(login((token || false)));
  }
}));

export default connect((state) => {
  return {}
}, mapDispatchToProps
)(App)
