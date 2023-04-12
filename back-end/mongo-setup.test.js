// const { MongoMemoryServer } = require('mongodb-memory-server');

// jest.mock('mongodb-memory-server');

// class mockConstructor {
//   async start() {}
//   async getUri() {
//     return 'mongodb://test-uri';
//   }
// }

// MongoMemoryServer.mockImplementation(() => {
//   return new mockConstructor();
// });

// const mongoSetup = require('./mongo-setup');

// describe('mongo-setup', () => {
//   it('should start the server and set the global variables', async () => {
//     await mongoSetup();

//     expect(global.__MONGO_URI__).toBe('mongodb://test-uri');
//     expect(global.__MONGOD__).toBeInstanceOf(mockConstructor);
//   });
// });



// mongo-setup.test.js
const mongoSetup = require('./mongo-setup');

describe('mongo-setup', () => {
  it('should execute without errors', async () => {
    await expect(mongoSetup()).resolves.toBeUndefined();
  });
});
