// Do this as the first thing so that any code reading it knows the right env.
process.env.ASSET_PATH = '/';

const webpack = require('webpack'),
    config = require('../webpack.config');

delete config.chromeExtensionBoilerplate;

config.mode = process.env.NODE_ENV;

webpack(config, function (err) {
  if (err) throw err;
});
