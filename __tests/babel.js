const { createTransformer } = require('babel-jest');

const options = {
  babelrc: false,
  presets: ['env', 'react'],
  plugins: ['transform-class-properties', 'transform-object-rest-spread'],
};

module.exports = createTransformer(options);
