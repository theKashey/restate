declare module 'react-redux-focus' {
    import * as React from 'react';

    /**
     * HOC for restate - focus
     * @param {state, props: any) => any} composeState
     * @param {dispatch, event: any, props: any) => void} routeDispatch
     * @param {{async?: boolean; areStatesEqual?: ((oldStore: any, newStore: any) => boolean)}} options
     * @return {(WrappedComponent: (React.ComponentClass<any> | React.StatelessComponent<any>)) => React.ComponentClass<any>}
     */
    export default function restate<T>(composeState: (state: any, props: any) => any,
                                       routeDispatch: (dispatch: any, event: any, props: any) => void,
                                       options: () => {
                                           async?: boolean;
                                           areStatesEqual?: (oldStore: any, newStore: any) => boolean;
                                       },): (WrappedComponent: React.ComponentClass<any> | React.StatelessComponent<any>) => React.ComponentClass<any>;

    export class ReduxFocus extends React.Component<{
        focus: (state: any, props: any) => any
        onDispatch: (dispatch: any, event: any, props: any) => void,
        children?: React.ReactElement<any>
    },
        React.ComponentState> {
    }
}
