declare module 'react-redux-restate' {
  import * as React from 'react';

  interface RestateOptions {
      /**
       * will defer any incoming change
       */
      async?: boolean;
      /**
       * the key for a `default` store.  Default `store`.
       */
      storeKey?: boolean;
      /**
       * the key for a result store. Default `store`.
       */
      restateKey?: boolean;
      /**
       * State comparison function
       * @param oldStore
       * @param newStore
       * @return {boolean}
       */
      areStatesEqual?: (oldStore: any, newStore: any) => boolean;
  }

  /**
   * Creates a Reprovider Component, which exports `oldStoreName` redux store, as a `newStoreName`.
   * @param {string} newStoreName
   * @param {string} oldStoreName = 'store'
   * @return {React.ComponentClass<any>}
   */
  export function reprovide(newStoreName: string, oldStoreName?: string): React.ComponentClass<any>;
  /**
   * Redux-restate HOC
   * @param {ObjectOf(store | string)} extraStores
   * @param {ObjectOf(state), props: any) => any} composeState
   * @param {ObjectOf(dispatch), event: any, props: any) => void} routeDispatch
   * @param {{async?: boolean; areStatesEqual?: ((oldStore: any, newStore: any) => boolean)}} options
   * @return {(WrappedComponent: (React.ComponentClass<any> | React.StatelessComponent<any>)) => React.ComponentClass<any>}
   */
  export default function restate<T>(
    extraStores: { [K in keyof T]: any },
    composeState: (states: { [K in keyof T]: any }, props: any) => any,
    routeDispatch: (dispatches: { [K in keyof T]: any }, event: any, props: any) => void,
    options: (props) => RestateOptions
  ): (WrappedComponent: React.ComponentClass<any> | React.StatelessComponent<any>) => React.ComponentClass<any>;
}
