declare module 'react-redux-restate' {
    import * as React from 'react'

    /**
     * HOC for restate
     * @param {ObjectOf(store | string)} extraStores
     * @param {ObjectOf(state), props: any) => any} composeState
     * @param {ObjectOf(dispatch), event: any, props: any) => void} routeDispatch
     * @param {{async?: boolean; areStatesEqual?: ((oldStore: any, newStore: any) => boolean)}} options
     * @return {(WrappedComponent: (React.ComponentClass<any> | React.StatelessComponent<any>)) => React.ComponentClass<any>}
     */
    export default function restate<T>(
        extraStores: {[K in keyof T]: any},
        composeState: (states: {[K in keyof T]: any}, props: any) => any,
        routeDispatch: (dispatches: {[K in keyof T]: any}, event: any, props: any) => void,
        options: {
            async?: boolean,
            areStatesEqual?: (oldStore: any, newStore: any) => boolean
        }
    ): (WrappedComponent: React.ComponentClass<any> | React.StatelessComponent<any>) => React.ComponentClass<any>
}