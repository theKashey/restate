import React, {Component} from 'react';
import {storiesOf} from '@storybook/react';

import DisplayCounter from './components/DisplayCounter';
import StopUpdates from './components/StopUpdates';

import {ReduxDelay} from '../packages/react-redux-delay/src';
import {ReduxFocus} from '../packages/react-redux-focus/src';

class DelayTest extends Component {
  state = {
    counter: 0,
  };

  componentDidMount() {
    this._tm = setInterval(() => this.setState(({counter}) => ({counter: counter + 1})), 1);
  }

  componentWillUnmount() {
    clearInterval(this._tm);
  }

  onCounter(state, props) {
    return props;
  }

  render() {
    return (
      <div>
        <ReduxFocus focus={this.onCounter} counter={this.state.counter}>
          <div>
            <div>
              counter1: <DisplayCounter/>
            </div>
            <ReduxDelay timeout={2000}>
              <div>
                counter2: <DisplayCounter/>
              </div>
            </ReduxDelay>
            <StopUpdates>
              <ReduxDelay timeout={2000}>
                <div>
                  counter3: <DisplayCounter/>
                </div>
              </ReduxDelay>
            </StopUpdates>
          </div>
        </ReduxFocus>
      </div>
    );
  }
}

storiesOf('Delay', module).add('Condition', () => <DelayTest/>);
