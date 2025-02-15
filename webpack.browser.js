const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.ts', // Your entry point
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    library: {
      name: 'MyLibrary', // Name of the global object that will hold your class
      type: 'umd',       // Universal Module Definition, works for both Node and browser
    },
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
  target: ['web'],
  devtool: 'source-map', // For debugging
  devServer: {
    static: './', // Serve from the dist folder
    port: 8080,
  },
};