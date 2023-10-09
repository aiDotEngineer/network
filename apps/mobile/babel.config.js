const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' });

// Make Expo Router run from `src/app` instead of `app`.
// Path is relative to `/node_modules/expo-router`
process.env.EXPO_ROUTER_APP_ROOT = '../../src/app';

// TODO: Remove this after upgrading to tamagui v1.62 or above
// Then we can remove babel-plugin-transform-inline-environment-variables
process.env.TAMAGUI_TARGET = 'native';

/** @type {import("@babel/core").ConfigFunction} */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      ['module-resolver', { alias: { '~': './src' } }],
      [
        'transform-inline-environment-variables',
        {
          include: ['TAMAGUI_TARGET', 'EXPO_API_HOST'],
        },
      ],
    ],
  };
};
