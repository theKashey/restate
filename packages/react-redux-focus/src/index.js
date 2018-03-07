import React from 'react';
import reactReduxRestate from 'react-redux-restate';
import PropTypes from 'prop-types';

const dispatchDefault = (dispatch, event) => dispatch(event);

const SECRET = '__focus_secret';
const RenderChildren = ({children}) => children;

const focus = (composeState, onDispatch = dispatchDefault, options = {}) => WrappedComponent =>
  reactReduxRestate(
    {},
    (stores, props) => composeState(stores.default, props),
    (dispatchers, event, props) => onDispatch(dispatchers.default, event, props),
    () => ({
      ...options,
      ignoreProps: [SECRET, 'componentProps'],
      deeperProps: ['componentProps']
    })
  )(WrappedComponent);

// Component model
const ComponentFocus = focus(
  (store, props) => props[SECRET].composeState(store, props),
  (dispatcher, event, props) => props[SECRET].onDispatch(dispatcher, event, props),
)(RenderChildren);

const focusSecret = {
  [SECRET]: {
    composeState: (store, props) => props.focus(store, props.componentProps),
    dispatch: (dispatcher, event, props) => props.onDispatch(dispatcher, event, props.componentProps),
  },
};

const ReduxFocus = ({focus, onDispatch, children, ...rest}) => (
    <ComponentFocus {...focusSecret} focus={focus} onDispatch={onDispatch} componentProps={rest}>
      {children}
    </ComponentFocus>
  );

ReduxFocus.propTypes = {
  focus: PropTypes.func.isRequired,
  onDispatch: PropTypes.func,
  children: PropTypes.node,
};

export {ReduxFocus};

export default focus;
