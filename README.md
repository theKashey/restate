# Restate

Restate, re-store, redux-focus, re-dux... Oh, it was not easy to name _The base layer for a redux composition_.

## The problem

As long React spreads component architecture and highly composable patterns,
the major part of it - Redux - do not follow this way.

In the world of redux **Store is a singlentone**.
You can create a connection to that store, and fetch the data you need. But how?

`Redux is the same for any connection, created from any point of Render Tree.`

You have to use React props, to pass the `ids` you need deeply into react Tree to use them to get the data out of the store.

Redux is not composable. Redux is not component friendly.

## The borders

Redux's connect method produces PureComponent.
No update from the top will pass PureComponent.
All updates will start from PureComponent.

`Connect is the end for all updates, and the beginning.`

Then you will change the store, **all** connected component will be triggered to update.
They will mapStateToProps and **maybe** do nothing more, in case the result object is shallowEqual to the older one.

Unless you will specify `areStatesEqual` for each connect, which is not quite possible, to say the truth.

## The idea

This is rework of ideas from Yandex Map API [Option Manager](https://tech.yandex.com/maps/doc/jsapi/2.1/ref/reference/option.Manager-docpage/).
Option Manager was build to handle 2 cases:

* GeoJSON. Where a lot of similar objects can be nested inside each other (features and collections).
* The single configuration file.

It is easier to explain via example:

1. You are setTimeone. You need your durition, and you are reading from store values named -> `duration`
2. Actually you are an animation. You prepend your request by your name -> `animationDuration`
3. Animation is internal component of Zoom Control. And it add to all data-requests passed from nested components it's name -> `zoomControlAnimationDuration`.
   As result - final component could use simple names - `color`, `duration`, `value`,- but store could contains much more complex names.

OptionManager (OptionMapper to be clear) work as lenses _scoping the store_.

## The solution

Redux-restate get:

* one or more stores as input,
* combine function to create a new store
* dispatch function, to handle dispatch

And produces the new store.

Thus makes redux composable, and enabled the component way.

> Restate is the end for any update, and the beginning. But not for all. Only the ones you need.

## The implementation

* redux-restate for redux level.
* react-redux-retate for react multy-state case.
* react-redux-focus for single store case.

## Usage

### redux-restate

```js
import restate from 'redux-restate';
const newStore = restate({ store: baseStore }, composeState, routeDispatch, options);
```

#### composeState

get one one more `states` as input, produce the output

#### routeDispatch

get one one more dispatch as input, then call the disired one with even, also provided.

### react-redux-restate

```js
import reactReduxRestate from 'react-redux-restate';
const RestatedComponent = reactReduxRestate(
  { otherStore: otherStore /*store or store key*/ }, // default store will be injected automagically
  (stores, props) => composeState,
  (dispatchers, event, props) => routeDispatch,
  options,
)(WrappedComponent);
```

The same as redux-restate, but in form of React HOC.
The default store, accessible with storeKey, is available as .default for next functions.

#### composeState

get one one more `states` as input, plus props, produce the output

#### routeDispatch

get one one more dispatch as input, plus props, then call the disired one with even, also provided.

### reproviding a state

Sometimes it is worth to keep the old store. Just `save` it using a different name.

```js
import { reprovide } from 'react-redux-restate';
const Reprovider = reprovide('new-store-name', 'old-store-name');
const Reprovider = reprovide('new-store-name'); // old will be `store`
```

### react-redux-focus

```js
import reactReduxFocus from 'react-redux-focus';
const FocusedComponent = reactReduxFocus(
  (state, props) => state.todos[props.id],
  (dispatch, event, props) => dispatch({ ...event, id: props.id }),
)(WrappedComponent);
```

The same as react-redux-restate, but for a single store.

## Multiple store case

It is absolutely common, that some parts of application can be **absolutely** independent.
But, in the same time, they are united. The simplest examples

* routing
* notifications
* user data
* analytics

Using the `composeState` you can control how your data passes **down**.  
Using the `routeDispatch` you can control how dispatches bubbles **up**.

* You can extend dispatched event by some data.
* You can choose which dispatch to call - the original one, from a nearest (default) store, or the parent one (the Application level)

## Examples
 Check out example-todo in packages.

### Before all the things - map Todos 
```js
const mapStateToProps = state => ({
  todos: getVisibleTodos(state.todos, state.visibilityFilter),
});

const mapDispatchToProps = {
  onTodoClick: toggleTodo,
};

export const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);
```

Next - render Todo...

### The original Redux-todo-list 
```js
const TodoListRedux = ({ todos, onTodoClick }) => (
  <ul>{todos.map(todo => 
      // Here redux "ends". You have to map onClick in magic way
      <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
  )}</ul>
);
```

### The remap variant
```js

// direct mapping. Here is nothing more that Todo need
const mapStateToProps = state => state;
const mapDispatchToProps = {
  onClick: toggleTodo,
};
const ConnectedTodo = connect(mapStateToProps, mapDispatchToProps)(Todo);

// Focusing on Todo-only
const TodoMapped = reduxFocus(
  (state, props) => state.todos[props.id],
  // Todo should just dispatch an event. All logic is here.
  (dispatch, event, props) => dispatch({ ...event, id: props.id }),
)(ConnectedTodo);
  
const TodoList = ({ todos, onTodoClick }) => <ul>{todos.map(todo => 
   <TodoMapped key={todo.id} id={todo.id} />
)}</ul>;
```

The variant with `Remap` is twice longer, but it will run faster out of the box.
No Todo will be re-rendered if any other gonna to change
Todo will become `isolated` from rest of application.

[![Animation](images/restate-todo.gif?raw=true "Todolist")]

## Licence

MIT
