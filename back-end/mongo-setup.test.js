const mongoSetup = require('./mongo-setup');

describe('mongo-setup', () => {
  it('should execute without errors', async () => {
    await expect(mongoSetup()).resolves.toBeUndefined();
  });
});
