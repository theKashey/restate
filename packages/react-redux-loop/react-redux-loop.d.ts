declare module 'react-redux-loop' {

    import * as React from 'react';

    export class ReduxLoop extends React.Component<{
        children: (event: any) => void;
    }> {
    }
}