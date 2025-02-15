const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  entry: './src/index.ts', // Your entry point
  output: {
    filename: 'bundle.node.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['babel-loader', 'ts-loader'], // Babel and TypeScript loader
        exclude: /node_modules/,
      },
    ],
  },
  target: 'node', // For Node.js environment
  externals: [nodeExternals()], // Exclude node modules
  devtool: 'source-map', // For debugging
};