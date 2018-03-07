import React, { Component } from 'react';

class StopUpdate extends Component {
  shouldComponentUpdate() {
    return false;
  }

  counter = 0;

  render() {
    return <div>{this.props.children}</div>;
  }
}

export default StopUpdate;
