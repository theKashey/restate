# React-redux-restate

> (a part of [restate](https://github.com/theKashey/restate) project)

The base layer for redux composition.

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

## The solution

Redux-restate get:

* one or more stores as input,
* combine function to create a new store
* dispatch function, to handle dispatch

And produces the new store.

Thus makes redux composable, and enabled the component way.

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
  { otherStore: otherStore },
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

### react-redux-focus

```js
import reactReduxFocus from 'react-redux-focus';
const FocusedComponent = reactReduxFocus(
  (state, props) => state.todos[props.id],
  (dispatch, event, props) => dispatch({ ...event, id: props.id }),
)(WrappedComponent);
```

The same as react-redux-restate, but for a single store.

## Licence

MIT
