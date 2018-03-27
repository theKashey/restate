<div align="center">
  <h1>React-redux-semaphore</h1>
  <br/>
  <img src="https://cdn.rawgit.com/theKashey/restate/1d67d86d/images/logo.svg" alt="restate" width="600" align="center">
  <br/>
  <br/>
  Every Redux store need a suspence...
  <br/>
  <br/>
  <a href="https://circleci.com/gh/theKashey/restate/tree/master">
   <img src="https://img.shields.io/circleci/project/github/theKashey/restate/master.svg?style=flat-square)" alt="Build status">
  </a> 
  <br/>
</div>

> (a part of [restate](https://github.com/theKashey/restate) project)

Only the chosen states will pass! This is a `redux` part of a React __Suspense__.

## The problem

Sometimes current state of a redux state is not acceptable. Thus you may prefer to use the old one.

For example you did update one data source, but could display (rerender) store only after another datasource will be updated.

Redux semaphore could stop update propagation, providing the old state for nested components.
You can use react-redux-restate to join the old state, and the new state down the tree.

Or you can just freeze ☃️ it out.

Let me cite the original Redux documentation:

```text
The original Flux pattern describes having multiple “stores” in an app, each one holding a different area of domain data. This can introduce issues such as needing to have one store “waitFor” another store to update. This is not necessary in Redux because the separation between data domains is already achieved by splitting a single reducer into smaller reducers.
```

react-redux-semaphore IS that `waitFor`.

## Usage

HOC approach.

```js
import reduxSemaphore from 'react-redux-semaphore';

const WillUseOldStateUnlessConditionAreMet = reduxSemaphore((state, props) => isValid(store.importantData))(
  TargetComponent,
);

const FreezableComponent = reduxSemaphore((state, props) => !props.isFreezed)(TargetComponent);
```

Component approach

```js
import { ReduxSemaphore } from 'react-redux-semaphore';
const conditionFreeze = (
  <ReduxSemaphore condition={(state, props) => isValid(store.importantData)}>
    <TargetComponent />
  </ReduxSemaphore>
);

const propFreeze = (
  <ReduxSemaphore locked>
    <TargetComponent />
  </ReduxSemaphore>
);
```

## Licence

MIT
