<div align="center">
  <h1>React-redux-delay</h1>
  <br/>
  <img src="https://cdn.rawgit.com/theKashey/restate/1d67d86d/images/logo.svg" alt="restate" width="600" align="center">
  <br/>
  <br/>
  Batching updates for the performance sake. 
  <br/>
  <br/>
  <a href="https://circleci.com/gh/theKashey/restate/tree/master">
   <img src="https://img.shields.io/circleci/project/github/theKashey/restate/master.svg?style=flat-square)" alt="Build status">
  </a> 
  <br/>
</div>

> (a part of [restate](https://github.com/theKashey/restate) project)

Just delay update propagation. Or debounce. Or Throttle. Why not?

Sometimes store could update rapidly. Much more often than you need. Known solution
to mitigate the problem is named `batching`.

For example - [redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe) - redux store enhancer to "batch" updates.
It just delays the notification of "subscribed" to redux elements, react-redux for example.

Redux-delay is doing absolutely the same, but from `react` side.

All the elements and their descendants, wrapped by ReduxDelay will receive redux store updates in batched, 
or, to be more concrete - debounced way.

```js
import reduxDelay, { ReduxDelay } from 'react-redux-delay';

const ThrottledComponent = reduxDelay(16 /* 60 "FPS" */, 'throttle')(BaseComponent);

const App = () => (
  <ReduxDelay timeout={200} mode="debounce">
    <RestOfApplication />
  </ReduxDelay>
);
```

Supported modes - 'debounce', or 'throttle'.

## Licence

MIT
