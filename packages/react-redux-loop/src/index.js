import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import loopMiddleware, {ADD_LOOPER, REMOVE_LOOPER} from "./middleware";

class UnconnectedReduxLoop extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.dispatch({type: ADD_LOOPER, payload: this.loop});
  }

  componentWillUnmount() {
    this.props.dispatch({type: REMOVE_LOOPER, payload: this.loop});
  }

  loop = (event) => {
    this.props.children(event);
  };

  render() {
    return null;
  }
};

const mapDispatch = dispatch => ({
  dispatch
});

const ReduxLoop = connect(null, mapDispatch)(UnconnectedReduxLoop);

const reduxLoop = actionCallback => props => (
  <ReduxLoop>
    {event => actionCallback(event, props)}
  </ReduxLoop>
);

const ReduxTrigger = ({when, then}) => (
  <ReduxLoop>
    {event => event.type === when && then(event)}
  </ReduxLoop>
);
ReduxTrigger.propTypes = {
  when: PropTypes.string.isRequired,
  then: PropTypes.func.isRequired
};

export {
  ReduxLoop,
  ReduxTrigger,
  loopMiddleware
};

export default reduxLoop;
