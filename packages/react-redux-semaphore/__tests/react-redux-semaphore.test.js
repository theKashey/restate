import React from 'react';
import Enzyme, { mount } from 'enzyme';
import storeMock from 'redux-mock-store';
import { Provider, connect } from 'react-redux';
import reduxSemaphore, { ReduxSemaphore } from '../src';
import reduxFocus, { ReduxFocus } from 'react-redux-focus';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('React-redux-semaphore', () => {
  const createStore = storeMock([]);

  var emitEvent = () => ({
    type: 'EVENT',
  });

  it('should block updates', () => {
    const storeData1 = {};

    const store1 = createStore(storeData1);

    const RenderAdd = ({ a, b, sum }) => (
      <div>
        {a} + {b} = {sum}
      </div>
    );

    const connectedRender = connect(({ a, b, sum }) => ({ a, b, sum }))(RenderAdd);

    const Semaphored = reduxSemaphore(({ a, b, sum }) => a + b === sum)(connectedRender);

    const PropsToStore = reduxFocus((store, props) => ({ ...props }))(Semaphored);

    const App = ({ a, b, sum }) => (
      <Provider store={store1}>
        <PropsToStore a={a} b={b} sum={sum} />
      </Provider>
    );

    const wrapper = mount(<App a={1} b={1} sum={2} />);

    expect(wrapper.text()).toBe('1 + 1 = 2');

    wrapper.setProps({
      a: 2,
      b: 2,
      sum: 4,
    });

    expect(wrapper.update().text()).toBe('2 + 2 = 4');

    wrapper.setProps({
      a: 2,
      b: 2,
      sum: 5,
    });

    // did not change
    expect(wrapper.text()).toBe('2 + 2 = 4');

    wrapper.setProps({
      a: 2,
      b: 3,
      sum: 5,
    });

    // did not change
    expect(wrapper.text()).toBe('2 + 3 = 5');
  });

  it('component approach', () => {
    const storeData1 = {};

    const store1 = createStore(storeData1);

    const RenderAdd = ({ a, b, sum }) => (
      <div>
        {a} + {b} = {sum}
      </div>
    );

    const ConnectedRender = connect(({ a, b, sum }) => ({ a, b, sum }))(RenderAdd);

    const TestApp = props => (
      <ReduxFocus focus={(state, props) => ({ ...props })} {...props}>
        <ReduxSemaphore condition={({ a, b, sum }) => ({ a, b, sum })}>
          <ConnectedRender />
        </ReduxSemaphore>
      </ReduxFocus>
    );

    const App = ({ a, b, sum }) => (
      <Provider store={store1}>
        <TestApp a={a} b={b} sum={sum} />
      </Provider>
    );

    const wrapper = mount(<App a={1} b={1} sum={2} />);

    expect(wrapper.text()).toBe('1 + 1 = 2');

    wrapper.setProps({
      a: 2,
      b: 2,
      sum: 4,
    });

    expect(wrapper.update().text()).toBe('2 + 2 = 4');
  });
});
