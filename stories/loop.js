import React, {Component} from 'react';
import {storiesOf} from '@storybook/react';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {connect, Provider} from 'react-redux';
import {ReduxLoop, loopMiddleware} from '../packages/react-redux-loop/src';

const list = (state, action) => {
  if (typeof state === 'undefined') {
    return [];
  }

  if (action.type === 'ACTION') {
    return [...state, '0'];
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

class LoopTest extends Component {

  state = {
    list: []
  };

  render() {
    return (
      <div>
        <button onClick={this.props.emit}/>
        <button onClick={this.props.emit2}/>
        Redux list:
        <ul>
          {this.props.list.map(x => <li>{x}</li>)}
        </ul>
        React reflection:
        <ul>
          {this.state.list.map(x => <li>{x}</li>)}
        </ul>
        <ReduxLoop>
          {action => this.setState({list: [...this.state.list, `1${  action.type}`]})}
        </ReduxLoop>
      </div>
    );
  }
}


const mapStateToProps = state => ({list: state.list});

const mapDispatchToProps = {
  emit: () => ({type: 'ACTION'}),
  emit2: () => ({type: 'ACTION2'})
};

const ConnectedLoopTest = connect(mapStateToProps, mapDispatchToProps)(LoopTest);


storiesOf('Loop', module)
  .add('ReduxLoop', () => <Provider store={store}><ConnectedLoopTest/></Provider>)
