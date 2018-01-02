const createSubscription = () => {
  const nextListeners = [];

  return {
    trigger() {
      const listeners = nextListeners;
      for (let i = 0; i < listeners.length; i++) {
        listeners[i]();
      }
    },

    subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new Error('Expected listener to be a function.');
      }

      let isSubscribed = true;

      nextListeners.push(listener);

      return function unsubscribe() {
        if (!isSubscribed) {
          return;
        }

        isSubscribed = false;

        const index = nextListeners.indexOf(listener);
        nextListeners.splice(index, 1);
      };
    },
  };
};

export default createSubscription;
