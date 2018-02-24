import React from 'react';
import reactReduxRestate from 'react-redux-restate';
import shallowequal from 'shallowequal';
import PropTypes from 'prop-types';

const unbranch = () => WrappedComponent =>
  reactReduxRestate(
    {},
    stores => stores.default,
    (dispatchers, event) => dispatchers.default(event),
    props => ({
      onUpdate: trigger => props.update(trigger),
      areStatesEqual: (newState, oldState) => props.compare(newState, oldState, props),
    }),
  )(WrappedComponent);

const RenderChildren = ({ children }) => children;
const Unbranch = unbranch()(RenderChildren);

const update = trigger => trigger();

const clearValues = keys =>
  keys.reduce((acc, key) => {
    acc[key] = undefined;
    return acc;
  }, {});

const compare = (newState, oldState, { ignoreKeys, passKeys, mode = 'ignore' }) => {
  if (mode === 'pass') {
    return passKeys.reduce((acc, key) => acc && newState[key] === oldState[key]);
  }
  return shallowequal({ ...newState, ...clearValues(ignoreKeys) }, { ...oldState, ...clearValues(ignoreKeys) });
};

export const ReduxUnbranch = ({ children, ignoreKeys = [], passKeys = [], mode = 'ignore' }) => (
  <Unbranch update={update} compare={compare} ignoreKeys={ignoreKeys} passKeys={passKeys} mode={mode}>
    {children}
  </Unbranch>
);

ReduxUnbranch.propTypes = {
  ignoreKeys: PropTypes.arrayOf(PropTypes.string),
  passKeys: PropTypes.arrayOf(PropTypes.string),
  mode: PropTypes.string,
  children: PropTypes.node,
};
