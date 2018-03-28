declare module 'react-redux-loop' {

    import * as React from 'react';

    interface Event {
        type: string,
        payload: any
    }

    type RenderFn = (event: Event) => void;

    interface LoopProps {
        children: RenderFn
    }

    interface TriggerProps {
        when: string,
        then: RenderFn
    }

    /**
     * Decalarative way to monitor all redux actions
     */
    export class ReduxLoop extends React.Component<LoopProps> {}

    /**
     * Declarative way to react to redux actions
     */
    export class ReduxTrigger extends React.Component<TriggerProps> {}

    /**
     * Redux-loop middleware
     */
    export const loopMiddleware: (store: any) => any;

    /**
     * HOC to make Redux-reactive component
     * @param {"react-redux-loop".RenderFn} callback
     * @return {React.ComponentType<any>}
     */
    export default function reduxLoop(callback: RenderFn): React.ComponentType<any>;
}