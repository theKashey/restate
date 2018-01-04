import React from 'react';
import Enzyme, { mount } from 'enzyme';
import storeMock from 'redux-mock-store';
import { Provider, connect } from 'react-redux';
import reactRestate, { reprovide } from '../src';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('React-redux-restate', () => {
  const createStore = storeMock([]);

  var emitEvent = () => ({
    type: 'EVENT',
  });

  it('should map props', () => {
    const storeData1 = {
      todos: [{ id: 1, akey: 'k1' }, { id: 2, akey: 'k2' }],
      data: 42,
    };
    const storeData2 = {
      userName: 'Doctor Who',
    };

    const store1 = createStore(storeData1);
    const store2 = createStore(storeData2);

    const Reprovide = reprovide('secondStore');

    const Component = props => (
      <div id={props.akey} onClick={props.emitEvent}>
        {props.id} {props.userName}
      </div>
    );
    const ConnectedComponent = connect(state => state, { emitEvent })(Component);

    const Remaped = reactRestate(
      {
        second: 'secondStore',
        third: store1,
      },
      (states, props) => ({
        ...states.second,
        data: states.third.data,
        ...states.default.todos[props.id - 1],
      }),
      (dispatchers, event, props) => dispatchers.default({ ...event, ...props }),
    )(ConnectedComponent);

    const wrapper = mount(
      <Provider store={store2}>
        <Reprovide>
          <Provider store={store1}>
            <div>
              <Remaped id={1} />
              <Remaped id={2} />
            </div>
          </Provider>
        </Reprovide>
      </Provider>,
    );

    expect(wrapper.find('#k1').props()).toMatchSnapshot();
    expect(wrapper.find('#k2').props()).toMatchSnapshot();

    wrapper.find('#k1').simulate('click');
    wrapper.find('#k2').simulate('click');

    expect(store1.getActions()).toMatchSnapshot();
    expect(store2.getActions()).toMatchSnapshot();
  });
});
