import React, { Component } from 'react';

class StopUpdate extends Component {
  counter = 0;

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

export default StopUpdate;
