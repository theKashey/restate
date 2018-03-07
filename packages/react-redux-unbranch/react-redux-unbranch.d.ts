declare module 'react-redux-unbranch' {

    import * as React from 'react';

    export class ReduxUnbranch extends React.Component<{
        ignoreKeys?: string[],
        passKeys?: string[],
        mode: 'pass' | 'ignore',
        children?: React.ReactElement<any>
    },
        React.ComponentState> {
    }

}
