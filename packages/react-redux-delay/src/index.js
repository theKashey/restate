import React, { Component } from 'react';
import reactReduxRestate from 'react-redux-restate';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

const makeUpdateFunction = (mode, delay) => {
  let triggerBack = null;
  let touch = null;

  if (mode === 'debounce') {
    touch = debounce(() => triggerBack(), delay);
  } else {
    touch = throttle(() => triggerBack(), delay);
  }
  return trigger => {
    triggerBack = trigger;
    touch();
  };
};

const SECRET = '__delay_secret';
const RenderChildren = ({ children }) => children;

const delay = (delay, mode, options) => WrappedComponent =>
  reactReduxRestate(
    {},
    stores => stores.default,
    (dispatchers, event) => dispatchers.default(event),
    props => ({
      onUpdate: makeUpdateFunction(mode, delay),
      ignoreProps: [SECRET],
      ...options(props),
    }),
  )(WrappedComponent);

// Component model

const ComponentDelay = delay(16, 'debounce', props => ({
  onUpdate: props[SECRET] && makeUpdateFunction(props[SECRET].mode, props[SECRET].delay),
}))(RenderChildren);

const focusSecret = (mode, delay) => ({
  [SECRET]: {
    mode,
    delay,
  },
});

const getSecret = props => focusSecret(props.mode, props.timeout);

class ReduxDelay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secret: getSecret(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.timeout !== this.props.timeout || nextProps.mode !== this.props.mode) {
      this.setState({ secret: getSecret(nextProps) });
    }
  }

  render() {
    return <ComponentDelay {...this.state.secret}>{this.props.children}</ComponentDelay>;
  }
}

ReduxDelay.propTypes = {
  mode: PropTypes.oneOf(['debounce', 'throttle']),
  timeout: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

export { ReduxDelay };

export default delay;
