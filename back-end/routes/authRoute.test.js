const request = require("supertest");
const express = require("express");
const authRoute = require("../routes/authRoute");
const authController = require("../controllers/authController");

jest.mock("../middlewares/checkCurrentUser", () => ({
  checkCurrentUser: jest.fn((req, res, next) => {
    req.user = { userId: "testUserId" };
    next();
  }),
}));

jest.mock("../middlewares/verifyToken", () => ({
  verifyToken: jest.fn((req, res, next) => {
    req.user = { userId: "testUserId" };
    next();
  }),
}));

jest.mock("../controllers/authController", () => ({
  login: jest.fn(),
  register: jest.fn(),
  getCurrentUser: jest.fn(),
  updateCurrentUser: jest.fn(),
  getAllUser: jest.fn(),
}));

describe("Auth Route", () => {
  const app = express();
  app.use(express.json());
  app.use("/", authRoute);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("POST /register", () => {
    it("should call register function in authController", async () => {
      const reqBody = { name: "test", email: "test@example.com", password: "test" };
      await request(app).post("/register").send(reqBody);

      expect(authController.register).toHaveBeenCalledTimes(1);
      expect(authController.register).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything());
    });
  });

  describe("POST /login", () => {
    it("should call login function in authController", async () => {
      const reqBody = { email: "test@example.com", password: "test" };
      await request(app).post("/login").send(reqBody);

      expect(authController.login).toHaveBeenCalledTimes(1);
      expect(authController.login).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything());
    });
  });

  describe("GET /", () => {
    it("should call checkCurrentUser and getCurrentUser functions in authController", async () => {
      await request(app).get("/");

      expect(authController.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(authController.getCurrentUser).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything());
    });
  });

  describe("GET /allUsers", () => {
    it("should call getAllUser function in authController", async () => {
      await request(app).get("/allUsers");

      expect(authController.getAllUser).toHaveBeenCalledTimes(1);
      expect(authController.getAllUser).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything());
    });
  });

  describe("GET /userProfile", () => {
    it("should call checkCurrentUser and getCurrentUser functions in authController", async () => {
      await request(app).get("/userProfile");

      expect(authController.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(authController.getCurrentUser).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything());
    });
  });

  describe("PUT /userProfile/:userId", () => {
    it("should call verifyToken and updateCurrentUser functions in authController", async () => {
      const reqBody = { name: "test" };
      await request(app).put("/userProfile/testUserId").send(reqBody);

      expect(authController.updateCurrentUser).toHaveBeenCalledTimes(1);
      expect(authController.updateCurrentUser).toHaveBeenCalledWith(expect.anything(), expect.anything(), expect.anything());
    });
  });
});
