/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html)$',
      },
    ],
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|sass|less)$': '<rootDir>/styleMock.js',
  },
  transformIgnorePatterns: ['node_modules/(?!.*)'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/main.ts',
    '!src/environments/**',
    '!src/app/app.*',
    '!src/app/app.config.ts',
    '!src/app/app.routes.ts',
    '!src/app/components/templates/**',
    '!src/app/services/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  testPathIgnorePatterns: ['<rootDir>/src/app/app.spec.ts'],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 30,
      functions: 40,
      lines: 50,
    },
  },
};
