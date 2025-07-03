import * as chai from "chai";
const expect = chai.expect;
import sinon from "sinon";

import {
  sequelizeUniqueConstraintError,
  sequelizeForeignKeyConstraintError,
  handleServerError,
  handleTodoError,
} from "../src/utills/errorHandler.js";
import modelsPkg from "../src/db/models/index.js";
const {Sequelize} = modelsPkg;

describe("Error handler utilities", () => {
  let res;
  before(() => {
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });
  after(() => {
    sinon.restore();
  });

  describe("sequelizeUniqueConstraintError", () => {
    it("should handle unique constraint error", () => {
      const error = {
        name: "SequelizeUniqueConstraintError",
        errors: [{ path: "email" }],
      };

      sequelizeUniqueConstraintError(error, res);

      expect(res.status.calledWith(409)).to.be.true;
      expect(res.json.calledWith({ error: `email already exists` })).to.be.true;
    });

    it("should return 500 for other errors", () => {
      const error = { name: "some other error" };

      sequelizeUniqueConstraintError(error, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: "Internal Server error" })).to.be
        .true;
    });
  });

  describe("sequelizeForeignKeyConstraintError", () => {
    it("should handle foreign key constraint error", () => {
      const error = {
        name: "SequelizeForeignKeyConstraintError",
      };

      sequelizeForeignKeyConstraintError(error, res);

      expect(res.status.calledWith(409)).to.be.true;
      expect(
        res.json.calledWith({
          error: "can not delete because your todo is pending",
        })
      ).to.be.true;
    });

    it("should return 500 for other errors", () => {
      const error = { name: "some other error" };

      sequelizeForeignKeyConstraintError(error, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(
        res.json.calledWith({ error: "An error occurred while deleting user" })
      ).to.be.true;
    });
  });

  describe("handleServerError", () => {
    it("should return internal server error", () => {
      const error = new Error("Some unexpected error");

      handleServerError(error, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: "Internal server error" })).to.be
        .true;
    });
  });

  describe("handleTodoError", () => {
    it("should return user not found message for FK error", () => {
      const error = new Sequelize.ForeignKeyConstraintError({});

      handleTodoError(error, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({ message: "Invalid userId: user does not exist." })
      ).to.be.true;
    });
    it("should return internal server error", () => {
      const error = new Error("Some unexpected error");

      handleServerError(error, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: "Internal server error" })).to.be
        .true;
    });
  });
});
