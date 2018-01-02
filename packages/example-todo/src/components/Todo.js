import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Todo extends Component {
  constructor() {
    super();
    this.counter = 0;
  }

  render() {
    const { onClick, completed, text } = this.props;
    this.counter++;
    return (
      <li
        onClick={onClick}
        data-counter={this.counter}
        style={{
          textDecoration: completed ? 'line-through' : 'none',
          backgroundColor: this.counter % 2 ? 'transparent' : '#FDD',
        }}
      >
        {text}
      </li>
    );
  }
}

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};

export default Todo;
