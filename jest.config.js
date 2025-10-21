module.exports = {
  roots: ['<rootDir>/test'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    'test/(.*)': '<rootDir>/test/$1',
    '@transaction-service/(.*)': '<rootDir>/src/$1',
  },
};
