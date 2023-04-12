const { connectDB } = require("./db");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

// Start an in-memory MongoDB instance before running the tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create(); // Change this line
  const mongoUri = mongoServer.getUri(); // Change this line
  process.env.DB_URI = mongoUri;
});

// Stop the in-memory MongoDB instance after running the tests
afterAll(async () => {
  await mongoServer.stop();
  await mongoose.connection.close();
});

describe("Database Connection", () => {
  it("should connect to the database successfully", async () => {
    await connectDB();
    expect(mongoose.connection.readyState).toBe(1);
  });
});
