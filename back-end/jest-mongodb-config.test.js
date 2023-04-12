const config = require('./jest-mongodb-config');

describe('mongodbMemoryServerOptions', () => {
  it('should have the correct structure', () => {
    const expectedConfig = {
      mongodbMemoryServerOptions: {
        binary: {
          version: '4.0.3',
          skipMD5: true,
        },
        instance: {
          dbName: 'jest',
        },
        autoStart: false,
      },
    };

    expect(config).toEqual(expectedConfig);
  });
});
