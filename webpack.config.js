var path = require('path');

module.exports = {
  entry: {
    app: ["./lib/main.js"]
  },
  output: {
    path: path.join(__dirname, 'lib'),
    publicPath: '/lib/',
    filename: 'traverse.js',
    devtoolModuleFilenameTemplate: '[resourcePath]',
    devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
  },
  devtool: 'source-map',
};
