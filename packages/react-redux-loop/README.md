<div align="center">
  <h1>React-redux-loop</h1>
  <br/>
  <img src="https://cdn.rawgit.com/theKashey/restate/1d67d86d/images/logo.svg" alt="restate" width="600" align="center">
  <br/>
  <br/>
  Big brother is watching your redux store.
  <br/>
  <br/>
  <a href="https://circleci.com/gh/theKashey/restate/tree/master">
   <img src="https://img.shields.io/circleci/project/github/theKashey/restate/master.svg?style=flat-square)" alt="Build status">
  </a> 
  <br/>
</div>

> (a part of [restate](https://github.com/theKashey/restate) project)

Allows to catch calls made to redux or dispatched inside redux.

These times, when applications becomes more diverse, redux is not a _single_ thing.
It have to coexists with other state managers, and those state manages have to communicate with redux.

It is always possible - they can always __read__ values from the store, and __dispatch__ a change back.

Meanwhile __redux could not communicate__ back. It could only emit state change. Making a lot of things a bit harder.
Usually - you dont need it. Redux is the start, and the end, Redux is a global state and stores everything.

That time have passed. You are not alone.

## API

### Inject middleware
```js
import { loopMiddleware } from 'react-redux-loop'

const store = createStore(
  reducer,
  compose(
    applyMiddleware(loopMiddleware),
  )
);
```

### Loop back on React

Comes in form of renderProp.

```js
import { ReduxLoop } from 'react-redux-loop';

  <ReduxLoop>
    { action => yourCode }
  </ReduxUnbranch>
```

Single-action helper function
```js
import { ReduxTrigger } from 'react-redux-loop';
<ReduxTrigger 
  when="ACTION_I_WAIT_FOR"
  then={ (event) => consume(event)}
/>
```

And HOC.
```js
import reduxLoop from 'react-redux-loop';

const ReduxLoopEndpoint = reduxLoop(
  (action, props) => action.type === 'THAT-ACTION' && props.callback(action)
);

<ReduxLoopEndpoint callback = {x => this.setState({x})} />  
```

And, you know, it can cause a loop, as long nothing prevents you to dispatch something back.

## Licence

MIT
