const fileEndngRegex = '\\.tsx?$';

module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 0,
    }
  },
  testURL: 'http://localhost', // https://github.com/jsdom/jsdom/issues/2304
  transform: {
    [fileEndngRegex]: 'ts-jest',
  },
  testRegex: `\\.spec${fileEndngRegex}`,
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
};
