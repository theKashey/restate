declare module 'react-redux-delay' {
  import * as React from 'react';

  /**
   * Delays event propagation in redux store
   * @param {number} delay in ms
   * @param {string} mode - 'debounce' or 'throttle'
   * @return {(WrappedComponent: (React.ComponentClass<any> | React.StatelessComponent<any>)) => React.ComponentClass<any>}
   */
  export default function delay<T>(
    delay: number,
    mode?: string,
  ): (WrappedComponent: React.ComponentClass<any> | React.StatelessComponent<any>) => React.ComponentClass<any>;
}
