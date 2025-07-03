import request from "supertest";
import * as chai from "chai";
const expect = chai.expect;

import { app } from "../server.js";
import db from "../src/db/models/index.js";
const User = db.user;

describe("In POST /registration", () => {
  after(async () => {
    await User.destroy({
      where: { email: "alice@gmail.com" },
    });
    await User.destroy({
      where: { email: "raina@gmail.com" },
    });
  });

  it("should register a user successfully", async () => {
    const res = await request(app)
      .post("/auth/registration")
      .field("email", "alice@gmail.com")
      .field("userName", "Alice")
      .field("phoneNo", "1234567890")
      .field("profile", "uploads/test.jpg")
      .field("password", "Alice@123");

    expect(res.status).to.be.eq(200);
    expect(res.body).to.have.property("message").that.is.a("string");
    expect(res.body).to.have.property("data").that.is.an("object");
  });
  it("should register a user if user have not uploaded image but filled other mandatory field", async () => {
    const res = await request(app)
      .post("/auth/registration")
      .field("email", "raina@gmail.com")
      .field("userName", "Raina")
      .field("phoneNo", "1234567890")
      .field("password", "Raina@123");

    expect(res.status).to.be.eq(200);
    expect(res.body).to.have.property("message").that.is.a("string");
    expect(res.body).to.have.property("data").that.is.an("object");
  });

  it("should return error if any mandatory field is empty", async () => {
    const res = await request(app)
      .post("/auth/registration")
      .field("phoneNo", "1234567890")
      .field("profile", "uploads/test.jpg")
      .field("password", "Test@123");

    expect(res.status).to.be.eq(400);
    expect(res.body).to.have.property("message").that.is.a("string");
  });

  it("should return error if value of field is not proper", async () => {
    const res = await request(app)
      .post("/auth/registration")
      .field("email", "test@gmail.")
      .field("userName", "Test")
      .field("phoneNo", "12345678")
      .field("profile", "uploads/test.jpg")
      .field("password", "Test@123");

    expect(res.status).to.be.eq(400);
    expect(res.body).to.have.property("message").that.is.a("string");
  });

  it("should return error if password is weak", async () => {
    const res = await request(app)
      .post("/auth/registration")
      .field("email", "test@gmail.com")
      .field("userName", "Test")
      .field("phoneNo", "12345678")
      .field("profile", "uploads/test.jpg")
      .field("password", "Test3");

    expect(res.status).to.be.eq(400);
    expect(res.body).to.have.property("message").that.is.a("string");
  });

  it("should return error if route is wrong", async () => {
    const res = await request(app)
      .post("/auth1/register")
      .field("email", "test@gmail.com")
      .field("userName", "Test")
      .field("phoneNo", "12345678")
      .field("profile", "uploads/test.jpg")
      .field("password", "Test@123");

    expect(res.status).to.be.eq(404);
    expect(res.body).to.have.property("error").that.is.a("string");
  });

  it("should return error if username and email already exists", async () => {
    const res = await request(app)
      .post("/auth/registration")
      .field("email", "alice@gmail.com")
      .field("userName", "Test")
      .field("phoneNo", "1234567890")
      .field("password", "Alice@123");

    expect(res.status).to.be.eq(409);
    expect(res.body).to.have.property("error");
  });
  // it("should return error if server fails", async () => {
  //   const res = await request(app)
  //   .post("/auth/registration")
  //     .field("email", "bob@gmail.com")
  //     .field("userName", "Bob")
  //     .field("phoneNo", "1234567890")
  //     .field("password", "Bob@1234");

  //     expect(res.status).to.be.eq(500);
  //     expect(res.body).to.have.property("error")
  // })
});

describe("Authenicate Flow", () => {
  before(async () => {
  const res = await request(app)
    .post("/auth/registration")
    .field("email", "black@gmail.com")
    .field("userName", "Black")
    .field("phoneNo", "1234567890")
    .field("password", "Black@123");
  
});
after(async () => {
  await User.destroy({where: {email: "black@gmail.com"}})
});

describe("In POST /login", () => {
 

  it("should login user if credentials are true", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "black@gmail.com", password: "Black@123" })
      .set("Accept", "application/json");

    expect(res.status).to.be.eq(200);
    expect(res.body).to.have.property("message").that.is.a("string");
    expect(res.body).to.have.property("token").that.is.a("string");
  });

  it("should return an error if credentials are not true", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "black@gmail.com", password: "Black@1" })
      .set("Accept", "application/json");

    expect(res.status).to.be.eq(401);
    expect(res.body).to.have.property("message").that.is.a("string");
  });
  it("should return an error if Email is empty", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ password: "Black@123" })
      .set("Accept", "application/json");
    expect(res.status).to.be.eq(400);
    expect(res.body).to.have.property("message").that.is.a("string");
  });
  it("should return an error if Password is empty", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "black@gmail.com" })
      .set("Accept", "application/json");

    expect(res.status).to.be.eq(400);
    expect(res.body).to.have.property("message").that.is.a("string");
  });
  it("should return an error if both field are empty", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({})
      .set("Accept", "application/json");

    expect(res.status).to.be.eq(400);
    expect(res.body).to.have.property("message").that.is.a("string");
  });
});

describe("IN POST /logout", () => {
  let token;
  before(async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "black@gmail.com", password: "Black@123" });

    token = res.body.token;
    console.log("token", token);
  });

  it("should user logout and add in to blacklist", async () => {
    const res = await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.be.eq(200);
    expect(res.body).to.have.property("message").that.is.a("string");

    const protectedRouteRes = await request(app)
      .post("/user/get-details")
      .set("Authorization", `Bearer ${token}`);

    expect(protectedRouteRes.status).to.be.eq(401);
    expect(protectedRouteRes.body)
      .to.have.property("error")
      .that.is.a("string");
  });

  it("should send an error if token is missing", async () => {
    const res = await request(app).post("/auth/logout");

    expect(res.status).to.be.eq(401);
    expect(res.body).to.have.property("error").that.is.a("string");
  });
});
})
 
