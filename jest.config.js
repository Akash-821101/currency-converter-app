module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    'react-native-vector-icons/(.+)':
      '<rootDir>/__mocks__/react-native-vector-icons.tsx',
  },
  // React Navigation v7 ships ESM-only; Babel must transform it.
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native(-community)?|@react-navigation)',
  ],
};
