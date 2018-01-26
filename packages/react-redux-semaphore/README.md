# React-redux-semaphore
> (a part of [restate](https://github.com/theKashey/restate) project)

Only the chosen states will pass!  

## The problem

Sometimes current state of a redux state is not acceptable. Thus you may prefer to use the old one.

For example you did update one data source, but could display (rerender) store only after another datasource will be updated.

Redux semaphore could stop update propagation, providing the old state for nested components. 
You can use react-redux-restate to join the old state, and the new state down the tree.

## Usage

HOC approach.
```js
import reduxSemaphore from 'react-redux-semaphore';
 
const WillUseOldStateUnlessConditionAreMet = reduxSemaphore(
  (state, props) => isValid(store.importantData)
)(TargetComponent)
```

Component approach
```js
import {ReduxSemaphore} from 'react-redux-semaphore';
 <ReduxSemaphore
  condition={(state, props) => isValid(store.importantData)}
 >
   <TargetComponent />
 </ReduxSemaphore>
```

## Licence

MIT
