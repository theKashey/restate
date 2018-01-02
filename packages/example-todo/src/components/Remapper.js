import React from 'react';
import reduxFocus from 'react-redux-focus';
import Todo from './Todo';
import { connect } from 'react-redux';
import { toggleTodo } from '../actions/index';

const mapStateToProps = state => state;
const mapDispatchToProps = {
  onClick: toggleTodo,
};

const ConnectedTodo = connect(mapStateToProps, mapDispatchToProps)(Todo);

const TodoMapped = reduxFocus(
  (state, props) => state.todos[props.id],
  (dispatch, event, props) => dispatch({ ...event, id: props.id }),
)(ConnectedTodo);

export default TodoMapped;
