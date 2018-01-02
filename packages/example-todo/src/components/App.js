import React from 'react';
import Footer from './Footer';
import AddTodo from '../containers/AddTodo';
import { VisibleTodoListRedux, VisibleTodoListRemap } from '../containers/VisibleTodoList';

const App = () => (
  <div>
    <AddTodo />
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <VisibleTodoListRedux />
      <VisibleTodoListRemap />
    </div>
    Left - redux. Right - remap. Color change - redraw. Just click and think.
    <Footer />
  </div>
);

export default App;
