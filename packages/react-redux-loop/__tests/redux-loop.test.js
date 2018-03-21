import React, {Component} from 'react';
import Enzyme, {mount} from 'enzyme';
import {Provider, connect} from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {ReduxLoop, loopMiddleware} from '../src';

Enzyme.configure({adapter: new Adapter()});


describe('React-redux-loop', () => {

  const list = (state, action) => {
    if (typeof state === 'undefined') {
      return [];
    }

    if (action.type === 'ACTION') {
      return [...state, action.payload];
    }
    return state
  };

  const reducer = combineReducers({
    list
  });

  const store = createStore(
    reducer,
    compose(
      applyMiddleware(loopMiddleware),
    )
  );

  it('should loop events', () => {

    class LoopTest extends Component {

      state = {
        list: []
      };

      componentDidMount() {
        this.props.emit();
      }

      render() {
        return (
          <div>
            Redux list:
            <div className="output">
              <ul>
                {this.props.list.map(x => <li>{x}</li>)}
              </ul>
              React reflection:
              <ul>
                {this.state.list.map(x => <li>{x}</li>)}
              </ul>
            </div>
            <ReduxLoop>
              {action => {
                this.setState({list: [...this.state.list, `${  action.type  }#${  action.payload}`]}, () => {
                  if (this.state.list.length < 10) {
                    this.props.emit(this.state.list.length);
                  }
                });
              }}
            </ReduxLoop>
          </div>
        );
      }
    }

    const mapStateToProps = state => ({list: state.list});
    const mapDispatchToProps = {
      emit: (id) => ({type: 'ACTION', payload: id})
    };

    const ConnectedLoopTest = connect(mapStateToProps, mapDispatchToProps)(LoopTest);

    const wrapper = mount(<Provider store={store}><ConnectedLoopTest/></Provider>);

    console.log(wrapper.debug());

    expect(wrapper.find(LoopTest).prop('list').length).toBe(10);
    expect(store.getState()).toMatchSnapshot();
  });
});
