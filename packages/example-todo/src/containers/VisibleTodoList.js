import { connect } from 'react-redux';
import { toggleTodo } from '../actions';
import TodoListRedux from '../components/TodoListRedux';
import TodoListRemap from '../components/TodoListRemap';
import { getVisibleTodos } from '../selectors/todos';

const mapStateToProps = state => ({
  todos: getVisibleTodos(state.todos, state.visibilityFilter),
});

const mapDispatchToProps = {
  onTodoClick: toggleTodo,
};

export const VisibleTodoListRedux = connect(mapStateToProps, mapDispatchToProps)(TodoListRedux);

export const VisibleTodoListRemap = connect(mapStateToProps, mapDispatchToProps)(TodoListRemap);
