import React from 'react';
import PropTypes from 'prop-types';
import reactReduxRestate from 'react-redux-restate';

const SECRET = '__semaphore_secret';
const RenderChildren = ({ children }) => children;

const semaphore = shouldApplyState => WrappedComponent =>
  reactReduxRestate(
    {},
    (stores, props) => (shouldApplyState(stores.default, props) ? stores.default : undefined),
    (dispatchers, event) => dispatchers.default(event),
    () => ({
      ignoreProps: [SECRET]
    })
  )(WrappedComponent);

// Component model
const ComponentSemaphore = semaphore((store, props) => props[SECRET].condition(store, props))(RenderChildren);

const semaphoreSecret = {
  [SECRET]: {
    condition: (stores, props) => props.condition(stores, props.componentProps),
  },
};

const simpleLock = (stores, props) => !props.locked;

const ReduxSemaphore = ({ condition = simpleLock, children, ...rest }) => (
  <ComponentSemaphore {...semaphoreSecret} condition={condition} componentProps={rest}>
    {children}
  </ComponentSemaphore>
);

ReduxSemaphore.propTypes = {
  condition: PropTypes.func,
  children: PropTypes.node,
  locked: PropTypes.bool,
};

export { ReduxSemaphore };

export default semaphore;
