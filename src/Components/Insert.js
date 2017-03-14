import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addTodo } from '../Actions/todo';

class Insert extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.setAreaValue = this.setAreaValue.bind(this);
  }
  componentDidMount() {
  }
  setAreaValue(event) {
    this.setState({
      value: event.target.value,
    });
  }
  render() {
    return (
      <div>
        <textarea value={this.state.value} onChange={this.setAreaValue} />
        <button
          onClick={() => {
            this.props.addText(this.state.value);
          }}
        >Add text</button>
      </div>
    );
  }
}

Insert.propTypes = {
  addText: PropTypes.func.isRequired,
};


const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  addText: (value) => {
    console.log("This should work as async.");
    setTimeout(() => {
      dispatch(addTodo(value));
    }, 1000);
  },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Insert);
