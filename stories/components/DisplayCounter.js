import React from 'react';
import { connect } from 'react-redux';

const Counter = ({ counter }) => <span>{counter}</span>;

const mapStateToProps = state => ({
  counter: state.counter,
});

export default connect(mapStateToProps)(Counter);
