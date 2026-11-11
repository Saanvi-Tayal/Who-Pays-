const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.blockList = [
  /who_pays_project_docs[\\\/].*/,
  /\.git[\\\/].*/,
];

module.exports = config;
