import * as chai from "chai";
const expect = chai.expect;
import request from "supertest";
import path from "path";
import { fileURLToPath } from "url";

import jwt from "jsonwebtoken";
import db from "../src/db/models/index.js";
import "dotenv/config";
import { app } from "../server.js";

describe("user GET and PUT API tests", () => {
  let testUser, token;
  before(async () => {
    testUser = await db.user.create({
      userName: "testUser",
      email: "testuser@gamil.com",
      phoneNo: "1234567890",
      password: "hashedpassword",
    });

    token = jwt.sign(
      {
        userId: testUser.id,
        userName: testUser.userName,
        email: testUser.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
  });

  after(async () => {
    await db.user.destroy({ where: { id: testUser.id } });
  });

  describe("In GET /user/get-details route", () => {
    it("GET /user/get-details should return user data", async () => {
      const res = await request(app)
        .get("/user/get-details")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.eq(200);
      expect(res.body.data).include({
        id: testUser.id,
        userName: testUser.userName,
        email: testUser.email,
        phoneNo: testUser.phoneNo,
      });
    });

    it("should return an error if user not found", async () => {
      let fakeUserId = 999999;

      let fakeToken = jwt.sign(
        {
          userId: fakeUserId,
          userName: "FakeUser",
          email: "fakeuser@gmail.com",
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      const res = await request(app)
        .get("/user/get-details")
        .set("Authorization", `Bearer ${fakeToken}`);

      //   console.log("res in first", res.status);
      //   console.log("res in first", res.body);

      expect(res.status).to.be.eq(404);
      expect(res.body).to.have.property("message").that.is.a("string");
    });
    it("should return an error if route is not found", async () => {
      const res = await request(app)
        .get("/todo/get-details")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.eq(404);
      expect(res.body).to.have.property("error");
    });
  });

  describe("In POST /user/update route", () => {
    it("should return users updated data", async () => {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const res = await request(app)
        .put("/user/update")
        .field("userName", "userNameChanged")
        .attach(
          "profile",
          path.resolve(
            __dirname,
            "../uploads/1750063482490_SampleJPGImage_200kbmb.jpg"
          )
        )
        .set("Authorization", `Bearer ${token}`);

      //   console.log("res in second", res.body);
      //   console.log("res in second", res.status);

      expect(res.status).to.be.eq(200);
      expect(res.body.data).to.include({
        id: testUser.id,
        userName: "userNameChanged",
        email: testUser.email,
        phoneNo: testUser.phoneNo,
      });
      expect(res.body.redirectToLogin).to.be.false;
      expect(res.body.data.profile).to.be.a("string").and.include("uploads");
    });

    it("should return an error if user does not exists", async () => {
      let fakeUserId = 999999;

      let fakeToken = jwt.sign(
        {
          userId: fakeUserId,
          userName: "FakeUser",
          email: "fakeuser@gmail.com",
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      const res = await request(app)
        .put("/user/update")
        .field("userName", "Ghost")
        .set("Authorization", `Bearer ${fakeToken}`);
      //   console.log("res in second", res.body);
      //   console.log("res in second", res.status);

      expect(res.status).to.be.eq(404);
      expect(res.body).to.have.property("message").that.is.a("string");
    });

    it("should return an error if details are not valid", async () => {
      const res = await request(app)
        .put("/user/update")
        .field("userName", "userName123")
        .field("email", "email@")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).to.be.eq(400);
      expect(res.body).to.have.property("message").that.is.a("string");
    });
    it("should return an error if route is not found", async () => {
      const res = await request(app)
        .put("/todo/updatesw")
        .field("userName", "userNameChanged")
        .field("email", "changedemail@gmail.com")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.eq(404);
      expect(res.body).to.have.property("error");
    });
    it("should return users updated data and redirectTologin true", async () => {
      const res = await request(app)
        .put("/user/update")
        .field("userName", "userNameChanged")
        .field("email", "changedemail@gmail.com")
        .set("Authorization", `Bearer ${token}`);

      //   console.log("res in second", res.body);
      //   console.log("res in second", res.status);

      expect(res.status).to.be.eq(200);
      expect(res.body.data).to.include({
        id: testUser.id,
        userName: "userNameChanged",
        email: "changedemail@gmail.com",
        phoneNo: testUser.phoneNo,
      });
      expect(res.body.redirectToLogin).to.be.true;
    });
    
  });
});

describe("In DELETE /user/delete route", () => {
  let testUser, token;
  before(async () => {
    testUser = await db.user.create({
      userName: "testUser",
      email: "testuser@gamil.com",
      phoneNo: "1234567890",
      password: "hashedpassword",
    });

    token = jwt.sign(
      {
        userId: testUser.id,
        userName: testUser.userName,
        email: testUser.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
  });

  after(async () => {
    await db.user.destroy({ where: { id: testUser.id } });
  });

  it("should delete user", async () => {
    const res = await request(app)
      .delete("/user/delete")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.be.eq(200);
    expect(res.body).to.have.property("message").that.is.a("string");
    expect(res.body.message).to.include("deleted");
  });

  it("should return an error if user does not exist", async () => {
    let fakeToken = jwt.sign(
      {
        userId: "abc",
        userName: "Test",
        email: "test@gmail.com",
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const res = await request(app)
      .delete("/user/delete")
      .set("Authorization", `Bearer ${fakeToken}`);

    expect(res.status).to.be.eq(404);
    expect(res.body).to.have.property("message");
  });

  it("should return an error if route is not found", async () => {
    const res = await request(app)
      .delete("/TODO/delete")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.be.eq(404);
    expect(res.body).to.have.property("error");
  });
});
