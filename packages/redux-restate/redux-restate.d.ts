declare module 'redux-restate' {
  /**
   * Creates syntetic redux store
   * @param {ObjectOf<ReduxStore>} stores
   * @param {ObjectOf<State>) => any} createState
   * @param {(dispatches: ObjectOf<dispatch>, event: any) => void} onDispatch
   * @param {{async?: boolean; areStatesEqual?: ((oldStore: any, newStore: any) => boolean)}} options
   * @return {ReduxStore}
   */
  export default function restate<T>(
    stores: { [K in keyof T]: any },
    createState: (states: { [K in keyof T]: any }) => any,
    onDispatch: (dispatches: { [K in keyof T]: any }, event: any) => void,
    options: (
      props,
    ) => {
      async?: boolean;
      onUpdate?: (triggerUpdate: () => void) => void;
      areStatesEqual?: (oldStore: any, newStore: any) => boolean;
    },
  ): any;
}
