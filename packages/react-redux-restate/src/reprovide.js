import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { createProvider } from 'react-redux';

const reprovide = (newName, oldName = 'store') => {
  const storeKey = oldName;
  const restateKey = newName;

  const Provider = createProvider(restateKey);

  class Reprovider extends Component {
    static contextTypes = {
      [storeKey]: PropTypes.any,
    };

    static propTypes = {
      children: React.node,
    };

    constructor(props, context) {
      super();
      this.store = props[storeKey] || context[storeKey];
    }

    render() {
      return <Provider store={this.store}>{this.props.children}</Provider>;
    }
  }

  return Reprovider;
};

export default reprovide;
