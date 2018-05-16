const path = require('path');

module.exports = (_, __, defaultConfig) => {
  defaultConfig.module.rules.push({
    test: /\.(ts|tsx)$/,
    include: [
      path.join(__dirname, '../src'),
      path.join(__dirname, '../stories')
    ],
    loader: require.resolve('ts-loader'),
  });
  defaultConfig.resolve.extensions.push('.ts', '.tsx');

  return defaultConfig;
};
