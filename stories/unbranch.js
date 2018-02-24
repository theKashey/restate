import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';

import DisplayCounter from './components/DisplayCounter';
import StopUpdates from './components/StopUpdates';

import { ReduxUnbranch } from '../packages/react-redux-unbranch/src';
import { ReduxFocus } from '../packages/react-redux-focus/src';

const key1 = ['counter'];

class DelayTest extends Component {
  state = {
    counter: 0,
    counter2: 0,
  };

  componentDidMount() {
    this._tm1 = setInterval(() => this.setState(({ counter }) => ({ counter: counter + 1 })), 50);
    this._tm2 = setInterval(() => this.setState(({ counter2 }) => ({ counter2: counter2 + 1 })), 1000);
  }

  componentWillUnmount() {
    clearInterval(this._tm1);
    clearInterval(this._tm2);
  }

  onCounter(state, props) {
    return props;
  }

  onSubCounter(state) {
    return {
      counter: state.counter2 + ':' + state.counter,
    };
  }

  render() {
    return (
      <div>
        <ReduxFocus focus={this.onCounter} {...this.state}>
          <div>
            <StopUpdates>
              <div>
                counter1: <DisplayCounter />
              </div>
              <ReduxFocus focus={this.onSubCounter}>
                <div>
                  counter2: <DisplayCounter />
                </div>
              </ReduxFocus>
              <StopUpdates>
                <ReduxUnbranch ignoreKeys={key1}>
                  <StopUpdates>
                    <div>
                      counter2: <DisplayCounter />
                    </div>
                    <ReduxFocus focus={this.onSubCounter}>
                      <div>
                        counter3: <DisplayCounter />
                      </div>
                    </ReduxFocus>
                  </StopUpdates>
                </ReduxUnbranch>
              </StopUpdates>
            </StopUpdates>
          </div>
        </ReduxFocus>
      </div>
    );
  }
}

storiesOf('Unbranch', module).add('3 counters', () => <DelayTest />);
