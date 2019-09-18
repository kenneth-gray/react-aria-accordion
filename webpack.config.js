const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: ['./src/Accordion/index.ts'],
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'index.js',
    library: 'ReactAriaAccordion',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react',
    },
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: path.join(__dirname, 'src')
      },
    ],
  },
};
