const babelRelayPlugin = require('babel-relay-plugin');
const schema = require('./cache/schema.json');

module.exports = babelRelayPlugin(schema.data);
