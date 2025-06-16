const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force Metro to use a single React instance
config.resolver.resolverMainFields = ['sbmodern', 'browser', 'main'];
config.resolver.extraNodeModules = {
  react: require.resolve('react'),
  'react-dom': require.resolve('react-dom'),
};

// Block duplicate React installations
config.resolver.blockList = [
  /node_modules\/.*\/node_modules\/react\/.*/,
  /node_modules\/.*\/node_modules\/react-dom\/.*/,
];

module.exports = config; 