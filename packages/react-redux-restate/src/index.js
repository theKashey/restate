import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createProvider } from 'react-redux';
import reduxRestate from 'redux-restate';
import hoistStatics from 'hoist-react-statics';
import displayName from 'react-display-name';

import reprovide from './reprovide';

const getStores = (stores, props, context) => {
  const result = {};
  Object.keys(stores).forEach(key => {
    const value = stores[key];
    if (typeof value === 'string') {
      const store = props[value] || context[value];
      if (store) {
        result[key] = store;
      } else {
        throw new Error(`restate: unable to found store {$value} for key ${key}`);
      }
    }
  });
  return result;
};

const restate = (baseStores, composeState, routeDispatch, options = {}) => WrappedComponent => {
  const storeKey = options.storeKey || 'store';
  const restateKey = options.restateKey || 'store';

  const Provider = createProvider(restateKey);

  const contextTypes = {
    [storeKey]: PropTypes.any,
  };
  Object.keys(baseStores).forEach(key => {
    const value = baseStores[key];
    if (typeof value === 'string') {
      contextTypes[value] = PropTypes.any;
    }
  });

  class RestateComponent extends Component {
    static contextTypes = contextTypes;

    constructor(props, context) {
      super();
      this.stores = {
        ...getStores(baseStores, this.props, this.context),
        default: props[storeKey] || context[storeKey],
      };
    }

    componentWillMount() {
      this.store = reduxRestate(this.stores, this.composeState, this.routeDispatch, options);
    }

    componentWillUnmount() {
      this.store.unsubscribe();
    }

    composeState = stores => composeState(stores, this.props);
    routeDispatch = (dispatches, event) => routeDispatch(dispatches, event, this.props);

    render() {
      return (
        <Provider store={this.store}>
          <WrappedComponent {...this.props} />
        </Provider>
      );
    }
  }

  hoistStatics(RestateComponent, WrappedComponent);
  RestateComponent.displayName = `reconnected(${displayName(WrappedComponent)})`;

  return RestateComponent;
};

export { reprovide };

export default restate;
