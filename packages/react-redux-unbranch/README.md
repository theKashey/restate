# React-redux-unbranch [WIP]
> (a part of [restate](https://github.com/theKashey/restate) project)

Detect used parts of a store, and cuts off updates. Towards zero.

WIP

```js
import {ReduxUnbranch} from 'react-redux-unbranch';

const scoped = 
  <ReduxUnbranch ignoreKeys={['a','b','c']}>
     // will ignore everything
  </ReduxUnbranch>
  
  
const scoped =   
  <ReduxUnbranch passKeys={['a','b','c']} mode="pass">
       // will ignore everything
  </ReduxUnbranch>
```

## Licence

MIT
