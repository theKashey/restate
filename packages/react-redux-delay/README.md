# React-redux-delay
> (a part of [restate](https://github.com/theKashey/restate) project)

Just delay update propagation. Or debounce. Or Throttle. Why not?


```js
import reduxDelay, { ReduxDelay } from 'react-redux-delay'

const ThrottledComponent = reduxDelay(1000, 'throttle')(BaseComponent);

const App = () => (
  <ReduxDelay timeout={1000} mode="debounce">
    <RestOfApplication />
  </ReduxDelay>  
);
```

Supported modes - 'debounce', or 'throttle'.

## Licence

MIT
