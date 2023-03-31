const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoServer = new MongoMemoryServer();

module.exports = async () => {
  // Start the server explicitly
  await mongoServer.start();

  // Get the MongoDB URI
  const uri = await mongoServer.getUri();

  // Set the global variables
  global.__MONGO_URI__ = uri;
  global.__MONGOD__ = mongoServer;
};
