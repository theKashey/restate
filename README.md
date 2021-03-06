<div align="center">
  <h1>RESTATE</h1>
  <br/>
  <img src="https://cdn.rawgit.com/theKashey/restate/1d67d86d/images/logo.svg" alt="restate" width="600" align="center">
  <br/>
  <br/>
  A fractal <u>state management</u> library. 
  <br/>
  <br/>
  <a href="https://circleci.com/gh/theKashey/restate/tree/master">
   <img src="https://img.shields.io/circleci/project/github/theKashey/restate/master.svg?style=flat-square)" alt="Build status">
  </a> <a href='https://greenkeeper.io/'><img src="https://badges.greenkeeper.io/theKashey/restate.svg" alt="Greenkeeper" /></a>
  <br/>
</div>

Restate connects to the Redux State __AND__ to the local component state, producing a new state, you can use with, or without Redux.

> Restate, re-store, redux-focus, redux-lenses, re-dux, redux-tree... Oh, it was not easy to name _The base layer for a redux composition_.

The goal of Restate is to provide hierarchical, decoupled, isolated synthetic stores, and make your application faster and simpler.
Restate just creates a new branch, from a original store, allowing you to control it, and use **composition
on redux**-level. And it does not need Redux for it. You can use Restate without Redux, _connecting_ your components to the syntetic derived state.

```js
import reduxRestate from 'redux-restate'; // to low-level redux manupulations
import reactReduxRestate from 'react-redux-restate'; // to work with multiple stores
import reactReduxFocus from 'react-redux-focus'; // to focus a lens on a single store
import reactReduxLoop from 'react-redux-loop'; // to call React from Redux
import reactSemaphore from 'react-redux-semaphore'; // to create *suspense* 
```

## The problem

As long React spreads component architecture and highly composable patterns,
the major part of it - Redux - do not follow this way.

In the world of redux **Store is a singlentone**.
You can create a connection to that store, and fetch the data you need. But how?

`Redux is the same for any connection, created from any point of Render Tree.`

You have to use React props, to pass the `ids` you need deeply into react Tree to use them to get the data out of the store.

Redux is not composable. Redux is not component friendly.

Medium articles about:
 [Restate](https://medium.com/@antonkorzunov/restate-the-story-of-redux-tree-27d8c5d1040a)
 , [Fractal state](https://blog.cloudboost.io/the-state-of-the-state-of-the-state-f93c8bdc6b1b)
 .
 

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
* recct-redux-semaphore to control update propagation.

# Usage

## redux-restate

```js
import restate from 'redux-restate';
const newStore = restate({ store: baseStore }, composeState, routeDispatch, options);
```

* `composeState(states):NewState` get one one more `states` as input, produce the output
* `routeDispatch(dispatchers, event)` get one one more dispatch as input, then call the disired one with even, also provided.

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

* `composeState(states, event, props)` get one one more `states` as input, plus props, produce the output

* `routeDispatch(dispatchers, event, props)` dispatch as input, plus props, then call the disired one with even, also provided.

> Note: if composeState will return _undefined_ the state will not change.

### reproviding a state

Sometimes it is worth to keep the old store. Just `save` it using a different name.

```js
import { reprovide } from 'react-redux-restate';
const Reprovider = reprovide('new-store-name', 'old-store-name');
const DefaultReprovider = reprovide('new-store-name'); // old will be `store`
```

### Fork/Unfork

There is a "standard way" to reprovide a state

```js
import { ForkReduxStore, UnforkReduxStore } from 'react-redux-restate';

const App = () => (
  <Provider state={state}>
    <ForkReduxState>
      // state "forked" into "global" state
      <FocusOrRestateTheStore>
        // state is "altered" here // you can always refer to "global" as a state key
        <UnforkReduxState>// state is reverted to the original</UnforkReduxState>
      </FocusOrRestateTheStore>
    </ForkReduxState>
  </Provider>
);
```

### react-redux-focus

```js
import reactReduxFocus from 'react-redux-focus';
const FocusedComponent = reactReduxFocus(
  (state, props) => state.todos[props.id],
  (dispatch, event, props) => dispatch({ ...event, id: props.id }),
)(WrappedComponent);
```

Or you can use Component approach

```js
import { ReduxFocus } from 'react-redux-focus';

<ReduxFocus
  focus={(state, props) => state.todos[props.id]}
  onDispatch={(dispatch, event, props) => dispatch({ ...event, id: props.id })}
>
  <WrappedComponent />
</ReduxFocus>;
```

The same as react-redux-restate, but for a single store.

* `composeState(state, props): newState` - focus will work only with one state
* `routeDispatch(dispatch, props)`

### react-redux-semaphore

HOC approach.

```js
import reduxSemaphore from 'react-redux-semaphore';

const WillUseOldStateUnlessConditionAreMet = reduxSemaphore((state, props) => isValid(store.importantData))(
  TargetComponent,
);
```

Component approach

```js
import { ReduxSemaphore } from 'react-redux-semaphore';
<ReduxSemaphore condition={(state, props) => isValid(store.importantData)}>
  <TargetComponent />
</ReduxSemaphore>;
```

## Optimization

Restate will perform shallowEqual compare for the old and the new states.
Please use `reselect` or another memoization library to keep branches unchanged.
Otherwise - specify `areStatesEqual` option.

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

#### Deepdive with Restart instantly

Connect all `restate` to the original store, just for original store lensing and optimization.

```js
 import {createProvider} from 'react-redux'
 import reactReduxRestate from 'react-redux-restate';

 const Provider = createProvider('non-default-name');
 const Remap = reactReduxRestate(...., {
   storeKey:'non-default-name'
   // restoreKey: 'store' // will defaults to store
 })
```

#### Isolate middle of application

Provide store, reprovide store, restore original store...

```js
import reactReduxRestate, { reprovider } from 'react-redux-restate';
const Reprovider = reprovider('realStore');
const RestoreStore = reprovider('store', 'realStore');

const RestateStore = reactReduxRestate(
  {}, // no extra stores
  states => focusOnSomeBranchIn(states.default),
  (dispatch, event, props) => dispatch.default({ ...event, id: props.id }),
);

const RestateWithOriginalStore = reactReduxRestate(
  { realStore: 'realStore' }, // connect the real store back
  states => mixStates(states.default, states.realStore),
  (dispatch, event, props) => dispatch.realStore({ ...event, id: props.id }),
);

const RestateForOriginalStore = reactReduxRestate(
  {}, // no extra stores
  states => focusOnSomeBranchIn(states.default),
  (dispatch, event, props) => dispatch.default({ ...event, id: props.id }),
  {
    storeKey: 'realStore', // use `realStore` as default
  },
);

const Application = () => (
  // put redux store inside
  <Provider store={myReduxStore}>
    // re-export current store as `realStore
    <Reprovider>
      // switch to syntetic redux
      <RestateStore>
        <SomePartOfAnApplication>
          // restore original store
          <RestoreStore>
            <WorkWithOriginalStore />
          </RestoreStore>
          // or use restate with 2 stores connected
          <RestateWithOriginalStore />
          // or connect restate to the real store
          <RestateForOriginalStore />
        </SomePartOfAnApplication>
      </RestateStore>
    </Reprovider>
  </Provider>
);
```

Also Check out example-todo in packages.

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
  <ul>
    {todos.map(todo => (
      // Here redux "ends". You have to map onClick in magic way
      <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
    ))}
  </ul>
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

const TodoList = ({ todos, onTodoClick }) => <ul>{todos.map(todo => <TodoMapped key={todo.id} id={todo.id} />)}</ul>;
```

The variant with `Remap` is twice longer, but it will run faster out of the box.
No Todo will be re-rendered if any other gonna to change
Todo will become `isolated` from rest of application.

[![Animation](images/restate-todo.gif?raw=true "Todolist")]

As result __you can re-connect any existing "connected" component__.

## Licence

MIT
