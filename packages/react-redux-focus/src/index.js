import React from 'react';
import reactReduxRestate, {ReduxRestate} from 'react-redux-restate';
import PropTypes from 'prop-types';

const dispatchDefault = (dispatch, event) => dispatch(event);

const focus = (composeState, onDispatch = dispatchDefault, options = {}) => WrappedComponent =>
  reactReduxRestate(
    {},
    (stores, props) => composeState(stores.default, props),
    (dispatchers, event, props) => onDispatch(dispatchers.default, event, props),
    options,
  )(WrappedComponent);

// Component model
const SECRET = '__focus_secret';
const RenderChildren = ({children}) => children;

const ComponentFocus = focus(
  (store, props) => props[SECRET].composeState(store, props),
  (dispatchers, event, props) => props[SECRET].onDispatch(dispatchers.default, event, props),
)(RenderChildren)


const focusSecret = {
  [SECRET]: {
    composeState: (stores, props) => props.focus(stores.default, props.componentProps),
    dispatch: (dispatchers, event, props) => props.onDispatch(dispatchers.default, event, props.componentProps)
  }
};

const ReduxFocus = ({focus, onDispatch, children, ...rest}) => {
  return <ComponentFocus {...focusSecret} focus={focus} onDispatch={onDispatch} componentProps={rest}>{children}</ComponentFocus>
};

ReduxFocus.propTypes = {
  focus: PropTypes.func.isRequired,
  onDispatch: PropTypes.func,
  children: PropTypes.node
};

export {
  ReduxFocus
};

export default focus;
