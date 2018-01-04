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
    acc[storeKey] = stores[storeKey].getState();
    return acc;
  }, {});

const restate = (stores, createState, onDispatch, options = {}) => {
  if (typeof createState !== 'function') {
    throw new Error('Please provide a createState function');
  }

  if (typeof onDispatch !== 'function') {
    throw new Error('Please provide a onDispatch function');
  }

  const nextState = () => createState(getStates(stores));

  let currentState = nextState();

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

  const areStatesEqual = (prev, next) =>
    (options.areStatesEqual && options.areStatesEqual(prev, next)) || shallowequal(prev, next);

  const triggerUpdate = () => {
    updatePending = false;
    const lastState = currentState;
    currentState = nextState();
    if (areStatesEqual(lastState, currentState)) {
      trigger();
    }
  };

  const update = () => {
    if (options.async) {
      if (!updatePending) {
        updatePending = Promise.resolve().then(triggerUpdate);
      }
    } else {
      triggerUpdate();
    }
  };

  const initialize = () => {
    Object.keys(stores).forEach(storeKey => subscriptions.push(stores[storeKey].subscribe(update)));
  };

  const unsubscribe = () => {
    subscriptions.forEach(unsubscribe => unsubscribe());
  };

  initialize();

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: createObservableFor(subscribe, getState),

    unsubscribe,
    update,
  };
};

export default restate;
