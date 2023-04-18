// const { connectDB } = require("./db");
// const mongoose = require("mongoose");
// const { MongoMemoryServer } = require("mongodb-memory-server");

// let mongoServer;

// // Start an in-memory MongoDB instance before running the tests
// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer.create(); // Change this line
//   const mongoUri = mongoServer.getUri(); // Change this line
//   process.env.DB_URI = mongoUri;
// });

// // Stop the in-memory MongoDB instance after running the tests
// afterAll(async () => {
//   await mongoServer.stop();
//   await mongoose.connection.close();
// });

// describe("Database Connection", () => {
//   it("should connect to the database successfully", async () => {
//     await connectDB();
//     expect(mongoose.connection.readyState).toBe(1);
//   });
// });




const { connectDB } = require("./db");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

// Start an in-memory MongoDB instance before running the tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
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

  // New test case for error scenario
  it("should fail to connect to the database and throw an error", async () => {
    // Spy on the mongoose.connect method and make it throw an error
    const error = new Error("Failed to connect to the database");
    jest.spyOn(mongoose, "connect").mockRejectedValueOnce(error);

    // Mock process.exit to prevent termination of the process
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});

    // A utility function to suppress console output during testing
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await connectDB();

    expect(mongoose.connection.readyState).not.toBe(1);
    expect(console.log).toHaveBeenCalledWith(error);
    expect(process.exit).toHaveBeenCalledWith(1);

    // Restore the original console.log and process.exit implementations
    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });
});
