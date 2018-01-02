import reactReduxRestate from 'react-redux-restate';

const dispatchDefault = (dispatch, event) => dispatch(event);

const focus = (composeState, onDispatch = dispatchDefault, options = {}) => WrappedComponent =>
  reactReduxRestate(
    {},
    (stores, props) => composeState(stores.default, props),
    (dispatchers, event, props) => onDispatch(dispatchers.default, event, props),
    options,
  )(WrappedComponent);

export default focus;
