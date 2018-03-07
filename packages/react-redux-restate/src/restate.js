import React, {Component} from 'react';
import PropTypes from 'prop-types';
import shallowequal from 'shallowequal';
import {createProvider} from 'react-redux';
import reduxRestate from 'redux-restate';
import hoistStatics from 'hoist-react-statics';
import displayName from 'react-display-name';

const getStores = (stores, props, context) => {
  const result = {};
  Object.keys(stores).forEach(key => {
    const value = stores[key];
    if (typeof value === 'string') {
      const store = props[value] || context[value];
      if (store) {
        result[key] = store;
      } else {
        throw new Error(`restate: unable to found store "${value}" for key "${key}"`);
      }
    } else {
      result[key] = value;
    }
  });
  return result;
};

const nullFn = () => ({});

const noChildren = {children: undefined};

const restate = (baseStores, composeState, routeDispatch, options = nullFn) => WrappedComponent => {
  if(options && typeof options !== 'function') {
    throw new Error('react-redux-restate: options should be an option')
  }
  const basicOptions = options({});
  const storeKey = basicOptions.storeKey || 'store';
  const restateKey = basicOptions.restateKey || 'store';

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

  const ignoredProps = {};
  const deeperProps = basicOptions.deeperProps || [];

  (basicOptions.ignoreProps || []).forEach(prop => {ignoredProps[prop] = undefined});

  const compareProps = (nextProps, currentProps, additionalIgnore = {}) => (
    shallowequal({...nextProps, ...ignoredProps, ...additionalIgnore}, {...currentProps, ...ignoredProps, ...additionalIgnore})
    && deeperProps.reduce((acc, line) => acc && shallowequal(nextProps[line], currentProps[line]), true)
  );

  class RestateComponent extends Component {
    static contextTypes = contextTypes;

    constructor(props, context) {
      super();
      this.stores = {
        ...getStores(baseStores, props, context),
        default: props[storeKey] || context[storeKey],
      };
      this.propsOverride = null;
    }

    componentWillMount() {
      this.store = reduxRestate(this.stores, this.composeState, this.routeDispatch, this.getOptions());
    }

    componentWillReceiveProps(nextProps) {
      if (!compareProps(nextProps, this.props, noChildren)) {
        this.propsOverride = nextProps;
        this.store.replaceOptions(options(nextProps));
        this.store.update();
        this.propsOverride = null;
      }
    }

    shouldComponentUpdate(nextProps) {
      return !compareProps(nextProps, this.props);
    }

    componentWillUnmount() {
      this.store.unsubscribe();
    }

    getOptions() {
      return options(this.props);
    }

    composeState = stores => composeState(stores, this.propsOverride || this.props);
    routeDispatch = (dispatches, event) => routeDispatch(dispatches, event, this.propsOverride || this.props);

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

export default restate;
