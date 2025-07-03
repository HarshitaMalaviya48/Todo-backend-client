import * as chai from "chai";
const expect = chai.expect;
import jwt from "jsonwebtoken";
import request from "supertest";
import sinon from "sinon";

import db from "../src/db/models/index.js";
import "dotenv/config";
import { app } from "../server.js";

describe("In todo API", () => {
  let testUser, token;
  let anothertestUser, anotherToken;
  let testTodo;

  before(async () => {
    testUser = await db.user.create({
      userName: "testUser",
      email: "testuser@gamil.com",
      phoneNo: "1234567890",
      password: "hashedpassword",
    });

    anothertestUser = await db.user.create({
       userName: "anotherUser",
      email: "anotheruser@gamil.com",
      phoneNo: "1234567890",
      password: "hashedpassword12",
    })

    testTodo = await db.todo.create({
      title: "This is todo",
      description: "This is basic description",
      date: "2005-03-12",
      userId: testUser.id,
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

    anotherToken = jwt.sign({
      userId: anothertestUser.id,
      userName: anothertestUser.userName,
      email: anothertestUser.email,
    }, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});
  });
  after(async () => {
    await db.todo.destroy({ where: { userId: testUser.id } });
    await db.user.destroy({ where: { id: testUser.id } });
    await db.user.destroy({ where: { id: anothertestUser.id } });
  });

  describe("IN POST /todo/create route", () => {
    it("should create todo for user", async () => {
      let testTodo2;
      testTodo2 = {
        title: "This is todo2",
        description: "This is basic description2",
        date: "2005-03-12",
        userId: testUser.id,
      };
      const res = await request(app)
        .post("/todo/create")
        .send(testTodo2)
        .set("Authorization", `Bearer ${token}`);

      console.log("in 1", res.status);
      console.log("in 1", res.body);

      expect(res.status).to.be.eq(200);
      expect(res.body).to.have.property("message").that.is.a("string");
      expect(res.body.data).to.include({
        title: "This is todo2",
        description: "This is basic description2",
        userId: testUser.id,
      });
      expect(res.body.data).to.have.property("date").that.is.a("string");
    });

    it("should return an error if field is empty", async () => {
      const res = await request(app)
        .post("/todo/create")
        .send({
          description: "Basic description",
        })
        .set("Authorization", `Bearer ${token}`);
      console.log("in 2", res.status);
      console.log("in 2", res.body);
      expect(res.status).to.be.eq(400);
      expect(res.body).to.have.property("message");
    });
    it("should return an error if date is not in format (yyyy-mm-dd)", async () => {
      const res = await request(app)
        .post("/todo/create")
        .send({
          title: "This is todo",
          description: "Basic description",
          date: "22-04-2005",
        })
        .set("Authorization", `Bearer ${token}`);
      console.log("in 3", res.status);
      console.log("in 3", res.body);
      expect(res.status).to.be.eq(400);
      expect(res.body).to.have.property("message");
    });
    it("should return an error if Route is not found", async () => {
      const res = await request(app)
        .post("/user/create")
        .send({
          title: "This is todo",
          description: "Basic description",
          date: "22-04-2005",
        })
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.eq(404);
      expect(res.body).to.have.property("error");
    });
    it("should return an error if route is not found", async () => {
      const res = await request(app)
        .get("/user/get-create")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.eq(404);
      expect(res.body).to.have.property("error");
    });
  });

  describe("In GET /todo/readTodos route", () => {
    after(() => {
      sinon.restore();
    });
    it("should return todos of user", async () => {
      const res = await request(app)
        .get("/todo/readTodos")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.eq(200);
      expect(res.body).to.have.property("data").that.is.an("array");
      expect(res.body.data[0]).to.have.property("id").that.is.a("number");
      expect(res.body.data[0]).to.have.property("title").that.is.a("string");
      expect(res.body.data[0])
        .to.have.property("description")
        .that.is.a("string");
    });

    it("should return an error if todo not found", async () => {
      sinon.stub(db.todo, "findAll").returns(null);

      const res = await request(app)
        .get("/todo/readTodos")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.eq(404);
      expect(res.body).to.have.property("message");
    });

    it("should return an error if route is not found", async () => {
      const res = await request(app)
        .get("/user/get-user")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.eq(404);
      expect(res.body).to.have.property("error");
    });
    
  });

  describe("In GET /todo/readTodo route", () => {
    it("should return todo", async () => {
      const res = await request(app)
        .get(`/todo/readTodo/${testTodo.id}`)
        .set("Authorization", `Bearer ${token}`);
      console.log("In todo read", res.body);
      console.log("In todo read", res.status);

      expect(res.status).to.be.eq(200);
      expect(res.body).to.have.property("data").that.is.an("object");
    });

    it("should return an error if todo not found", async () => {
      const res = await request(app)
        .get(`/todo/readTodo/${0}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.eq(404);
      expect(res.body).to.have.property("message");
    });

    it("should return an error if route is not found", async () => {
      const res = await request(app)
        .get("/user/get-user")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.eq(404);
      expect(res.body).to.have.property("error");
    });
  });

  describe("In PUT /todo/update route", () => {
    let upedatedTodo = {
      title: "This is updated todo",
      description: "This is updated basic description",
      date: "2005-03-12",
    };
    it("should update todo", async () => {
      const res = await request(app)
        .put(`/todo/update/${testTodo.id}`)
        .send(upedatedTodo)
        .set("Authorization", `Bearer ${token}`);
        
        console.log("In update todo", res.status);
        console.log("In update todo", res.BODY);
      expect(res.status).to.be.eq(200);
      expect(res.body).to.have.property("message");
      expect(res.body).to.have.property("data").that.is.an("object");
      expect(res.body.data).to.include({
        title: "This is updated todo",
        description: "This is updated basic description",
      });
    });

     it("should return an error if user is unathorized", async () => {
      const res = await request(app)
        .put(`/todo/update/${testTodo.id}`)
        .set("Authorization", `Bearer ${anotherToken}`);

        // console.log("in unauth", res.status);
        // console.log("in unauth", res.body);
        
      expect(res.status).to.be.eq(401);
      expect(res.body).to.have.property("message");
      expect(res.body.message).to.include("Unauthorized");
    })

    it("should return an error if todo not found", async () => {
      const res = await request(app)
        .put(`/todo/update/${0}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.eq(404);
      expect(res.body).to.have.property("message");
    });

    it("should return an error if route is not found", async () => {
      const res = await request(app)
        .get("/user/update-user")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.eq(404);
      expect(res.body).to.have.property("error");
    });
  });

   describe("In DELETE /todo/delete route", () => {
     it("should return an error if user is unathorized", async () => {
      const res = await request(app)
        .delete(`/todo/delete/${testTodo.id}`)
        .set("Authorization", `Bearer ${anotherToken}`);

        // console.log("in unauth", res.status);
        // console.log("in unauth", res.body);
        
      expect(res.status).to.be.eq(401);
      expect(res.body).to.have.property("message");
      expect(res.body.message).to.include("Unauthorized");
    })
    it("should delete todo", async () => {
      const res = await request(app)
        .delete(`/todo/delete/${testTodo.id}`)
        .set("Authorization", `Bearer ${token}`);
      console.log("in delete", res.status);
      console.log("in delete", res.body);

      expect(res.status).to.be.eq(200);
      expect(res.body).to.have.property("message");
    });
    it("should return an error if todo not found", async () => {
      const res = await request(app)
        .delete(`/todo/delete/${0}`)
        .set("Authorization", `Bearer ${token}`);
      console.log("in delete", res.status);
      console.log("in delete", res.body);

      expect(res.status).to.be.eq(404);
      expect(res.body).to.have.property("message");
    });
   
    it("should return an error if route is not found", async () => {
      const res = await request(app)
        .get("/user/get-delete")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).to.be.eq(404);
      expect(res.body).to.have.property("error");
    });
  });
});


