import $$observable from 'symbol-observable';
import shallowequal from 'shallowequal';
import createObservableFor from './observable';
import createSubscription from './subscribe';

const replaceReducer = () => {
  throw new Error('Dont call replaceReducer on synthetic store.');
};

const getDispatches = stores => {
  const result = {
    called: null,
    returnedValue: null,
    next: Object.keys(stores).reduce((acc, storeKey) => {
      acc[storeKey] = event => {
        result.called = storeKey;
        result.returnedValue = stores[storeKey].dispatch(event);
      };
      return acc;
    }, {}),
  };
  return result;
};

const getStates = stores =>
  Object.keys(stores).reduce((acc, storeKey) => {
    acc[storeKey] = stores[storeKey] && stores[storeKey].getState();
    return acc;
  }, {});

const restate = (stores, createState, onDispatch, initialOptions = {}) => {
  let options = initialOptions;
  if (typeof createState !== 'function') {
    throw new Error('Please provide a createState function');
  }

  if (typeof onDispatch !== 'function') {
    throw new Error('Please provide a onDispatch function');
  }

  const nextState = oldState => createState(getStates(stores)) || oldState;

  let currentState = nextState({});

  let updatePending = false;
  const subscriptions = [];
  const { subscribe, trigger } = createSubscription();

  const dispatch = event => {
    const dispatchers = getDispatches(stores);
    onDispatch(dispatchers.next, event);
    if (!dispatchers.called) {
      console.error('No next dispatch was called at', onDispatch);
      throw new Error('No next dispatch called');
    }
    return dispatchers.returnedValue;
  };

  const getState = () => currentState;

  const areStatesEqual = (prev, next) => {
    const areEqual = options.areStatesEqual && options.areStatesEqual(prev, next);
    return typeof areEqual === 'undefined' ? shallowequal(prev, next) : areEqual;
  };

  const onStateUpdate = () => {
    if (options.async) {
      if (!updatePending) {
        updatePending = Promise.resolve().then(() => {
          updatePending = null;
          trigger();
        });
      }
    } else if (options.onUpdate) {
      options.onUpdate(trigger);
    } else {
      trigger();
    }
  };

  const triggerUpdate = () => {
    const lastState = currentState;
    currentState = nextState(currentState);
    if (!areStatesEqual(lastState, currentState)) {
      onStateUpdate();
    }
  };

  const initialize = () => {
    Object.keys(stores)
      .filter(key => stores[key])
      .forEach(storeKey => subscriptions.push(stores[storeKey].subscribe(triggerUpdate)));
  };

  const unsubscribe = () => {
    subscriptions.forEach(unsubscribe => unsubscribe());
  };

  const replaceOptions = newOptions => {
    options = {
      ...options,
      newOptions,
    };
  };

  initialize();

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: createObservableFor(subscribe, getState),

    unsubscribe,
    update: triggerUpdate,
    replaceOptions,
  };
};

export default restate;
