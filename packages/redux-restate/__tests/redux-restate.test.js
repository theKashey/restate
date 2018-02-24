import storeMock from 'redux-mock-store';
import restate from '../src';

describe('redux-restate', () => {
  const createStore = storeMock([]);

  it('smoke test', () => {
    let storeData1 = {
      branch1: { a: 1 },
      brancha: {},
    };

    const storeData2 = {
      branch1: { b: 2 },
      branchb: {},
    };

    const store1 = createStore(() => storeData1);
    const store2 = createStore(() => storeData2);

    const restore = restate(
      {
        store1,
        store2,
      },
      ({ store1: state1, store2: state2 }) => ({
        ...state1,
        ...state2,
        soil: 42,
      }),
      ({ store1: dispatch1, store2: dispatch2 }, event) => {
        if (event.store === 1) {
          dispatch1(event);
        } else {
          dispatch2(event);
        }
      },
    );

    expect(restore.getState()).toEqual({
      branch1: { b: 2 },
      brancha: {},
      branchb: {},
      soil: 42,
    });

    const listener1 = jest.fn();
    const listener2 = jest.fn();
    const listenerr = jest.fn();

    store1.subscribe(listener1);
    store2.subscribe(listener2);

    const unsubscribe1 = restore.subscribe(listenerr);

    store1.dispatch({ type: 'event', id: 1 });
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(0);
    expect(listenerr).toHaveBeenCalledTimes(0);

    storeData1 = {
      ...storeData1,
      change: 1,
    };

    store1.dispatch({ type: 'event', id: 1 });
    expect(listenerr).toHaveBeenCalledTimes(1);
    store2.dispatch({ type: 'event', id: 1 });
    expect(listenerr).toHaveBeenCalledTimes(1);

    unsubscribe1();

    storeData1 = {
      ...storeData1,
      change: 2,
    };

    store2.dispatch({ type: 'event', id: 1 });
    expect(listener1).toHaveBeenCalledTimes(2);
    expect(listener2).toHaveBeenCalledTimes(2);
    expect(listenerr).toHaveBeenCalledTimes(1);

    restore.subscribe(listenerr);

    restore.dispatch({ type: 'event', store: 1 });
    expect(listener1).toHaveBeenCalledTimes(3);
    expect(listener2).toHaveBeenCalledTimes(2);

    restore.dispatch({ type: 'event', store: 2 });
    expect(listener1).toHaveBeenCalledTimes(3);
    expect(listener2).toHaveBeenCalledTimes(3);

    expect(store1.getActions()).toMatchSnapshot();
    expect(store2.getActions()).toMatchSnapshot();
  });

  it('should stop focued updates', () => {});
});
