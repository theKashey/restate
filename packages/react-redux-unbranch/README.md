<div align="center">
  <h1>React-redux-unbranch</h1>
  <br/>
  <img src="https://cdn.rawgit.com/theKashey/restate/1d67d86d/images/logo.svg" alt="restate" width="600" align="center">
  <br/>
  <br/>
  Isolate descendants from unnesserary store updates. 
  <br/>
  <br/>
  <a href="https://circleci.com/gh/theKashey/restate/tree/master">
   <img src="https://img.shields.io/circleci/project/github/theKashey/restate/master.svg?style=flat-square)" alt="Build status">
  </a> 
  <br/>
</div>

> (a part of [restate](https://github.com/theKashey/restate) project)

Detect used parts of a store, and cuts off updates. Towards zero.

[WIP, only manual settings working so far]. Try [beautiful-react-redux](https://github.com/theKashey/beautiful-react-redux] instead

```js
import { ReduxUnbranch } from 'react-redux-unbranch';

const scoped = <ReduxUnbranch ignoreKeys={['a', 'b', 'c']}>// will ignore everything</ReduxUnbranch>;

const scoped = (
  <ReduxUnbranch passKeys={['a', 'b', 'c']} mode="pass">
    // will ignore everything
  </ReduxUnbranch>
);
```

## Licence

MIT
