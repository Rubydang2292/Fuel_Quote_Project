const config = require('./jest.config');

describe('jest.config', () => {
  it('should have the correct structure', () => {
    const expectedConfig = {
      testEnvironment: 'node',
      globalSetup: './mongo-setup.js',
    };

    expect(config).toEqual(expectedConfig);
  });
});
