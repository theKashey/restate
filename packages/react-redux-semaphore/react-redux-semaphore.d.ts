declare module 'react-redux-semaphore' {
  import * as React from 'react';

  /**
   * HOC for restate - semaphore
   * @param {state, props: any) => boolean} shouldApplyState
   * @return {(WrappedComponent: (React.ComponentClass<any> | React.StatelessComponent<any>)) => React.ComponentClass<any>}
   */
  export default function semaphore<T>(
    shouldApplyState: (state: any, props: any) => boolean,
  ): (WrappedComponent: React.ComponentClass<any> | React.StatelessComponent<any>) => React.ComponentClass<any>;
}
