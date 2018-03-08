import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';

import DisplayCounter from './components/DisplayCounter';

import { ReduxSemaphore } from '../packages/react-redux-semaphore/src';
import { ReduxFocus } from '../packages/react-redux-focus/src';

class SemaphoreTest extends Component {
  state = {
    counter: 0,
    locked: false,
  };

  componentDidMount() {
    this._tm = setInterval(() => this.setState(({ counter }) => ({ counter: counter + 1 })), 100);
  }

  componentWillUnmount() {
    clearInterval(this._tm);
  }

  onCounter(state, props) {
    return props;
  }

  swapLock = () => this.setState(({ locked }) => ({ locked: !locked }));

  render() {
    return (
      <div>
        <button onClick={this.swapLock}>{this.state.locked ? 'Unfreeze' : 'Freeze'}</button>
        <ReduxFocus focus={(state, props) => props} counter={this.state.counter}>
          <div>
            counter1: <DisplayCounter />
          </div>
          <ReduxSemaphore locked={this.state.locked}>
            <div>
              counter2: <DisplayCounter />
            </div>
          </ReduxSemaphore>
        </ReduxFocus>
      </div>
    );
  }
}

class SemaphoreTestCondition extends Component {
  state = {
    counter: 0,
  };

  componentDidMount() {
    this._tm = setInterval(() => this.setState(({ counter }) => ({ counter: counter + 1 })), 100);
  }

  componentWillUnmount() {
    clearInterval(this._tm);
  }

  onCounter(state, props) {
    return props;
  }

  onCondition(state) {
    return state.counter % 2;
  }

  render() {
    return (
      <div>
        <ReduxFocus focus={this.onCounter} counter={this.state.counter}>
          <div>
            counter1: <DisplayCounter />
          </div>
          <ReduxSemaphore condition={this.onCondition}>
            <div>
              counter2: <DisplayCounter />
            </div>
          </ReduxSemaphore>
        </ReduxFocus>
      </div>
    );
  }
}

storiesOf('Semaphore', module)
  .add('Freeze/unfreeze', () => <SemaphoreTest />)
  .add('Condition', () => <SemaphoreTestCondition />);
