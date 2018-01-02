import React from 'react';
import PropTypes from 'prop-types';
import TodoMapped from './Remapper';

const TodoList = ({ todos, onTodoClick }) => <ul>{todos.map(todo => <TodoMapped key={todo.id} id={todo.id} />)}</ul>;

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  onTodoClick: PropTypes.func.isRequired,
};

export default TodoList;
