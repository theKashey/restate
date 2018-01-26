import React from 'react';
import PropTypes from 'prop-types';
import reactReduxRestate from 'react-redux-restate';

const semaphore = (shouldApplyState) => WrappedComponent =>
  reactReduxRestate(
    {},
    (stores, props) => shouldApplyState(stores.default, props) ? stores.default : undefined,
    (dispatchers, event) => dispatchers.default(event),
  )(WrappedComponent);

// Component model
const SECRET = '__semaphore_secret';
const RenderChildren = ({children}) => children;

const ComponentSemaphore = semaphore(
  (store, props) => props[SECRET].condition(store, props),
)(RenderChildren);

const semaphoreSecret = {
  [SECRET]: {
    condition: (stores, props) => props.condition(stores, props.componentProps)
  }
};

const ReduxSemaphore = ({condition, children, ...rest}) => {
  return <ComponentSemaphore {...semaphoreSecret} condition={condition} componentProps={rest}>{children}</ComponentSemaphore>
};

ReduxSemaphore.propTypes = {
  condition: PropTypes.func.isRequired,
  children: PropTypes.node
};

export {
  ReduxSemaphore
};

export default semaphore;
