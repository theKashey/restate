import $$observable from 'symbol-observable';

const createObservableFor = (subscribe, getState) =>
  function observable() {
    const outerSubscribe = subscribe;
    return {
      subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        const unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe,
        };
      },

      [$$observable]() {
        return this;
      },
    };
  };

export default createObservableFor;
