import { jwtAuthMiddleware, generateToken } from "../src/middleware/jwt.js";
import jwt from "jsonwebtoken";
import db from "../src/db/models/index.js"
import "dotenv/config";

import sinon from "sinon";
import sinonChai from "sinon-chai";
import httpMocks from "node-mocks-http"
import * as chai from "chai";
const expect = chai.expect;
chai.use(sinonChai);

describe("In generateToken function", () => {
  const payload = {
    id: 145,
    userName: "Alice",
    email: "Alice@gmail.com",
  };
  it("should generate token", async () => {
    const token = await generateToken(payload);
    expect(token).to.be.a("string");
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log(decoded);

    expect(decoded).to.include({
      userId: payload.id,
      email: payload.email,
      userName: payload.userName,
    });
    expect(decoded).to.have.property("iat");
    expect(decoded).to.have.property("exp");
  });
});

describe("In jwtAuthMiddleware", () => {
    let req, res, next;
    let token = "jwt.fake.token";
    let user = {id: 1, userName: "john", email: "john@gamil.com"};

    beforeEach(() => {
        req = httpMocks.createRequest({
            method: "GET",
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        res = httpMocks.createResponse();
        next = sinon.spy();
    })

    afterEach(() => {
        sinon.restore();
    })

    it("should allow access with valid token", async () => {
        sinon.stub(db.blackListToken, "findOne").resolves(null);
        sinon.stub(jwt, "verify").returns(user);

        await jwtAuthMiddleware(req, res, next);
        expect(next).to.have.been.calledOnce;
        expect(req.user).to.deep.equal(user);
    })

    it("should return an error if token is missing", async () => {
        req.headers.authorization = "";

        await jwtAuthMiddleware(req, res, next);
        console.log("res", res._getData());
        
        expect(res.statusCode).to.be.eq(401);
        expect(res._getData()).to.include("Unauthorized");
        expect(next).not.to.have.been.called
    })

    it("should return an error if token is missing", async () => {
        req.headers.authorization = "Bearer ";

        await jwtAuthMiddleware(req, res, next);
        const data = JSON.parse(res._getData());
        expect(res.statusCode).to.be.eq(401);
        expect(data).to.have.property("error").that.is.a("string");
        expect(data.error).to.include("Unauthorized");
        expect(next).not.to.have.been.called;
    })

    it("should return an error if token is blacklisted", async () => {
        sinon.stub(db.blackListToken, "findOne").resolves({token});

        await jwtAuthMiddleware(req, res, next);

        expect(res.statusCode).to.be.eq(401);
        expect(res._getData()).to.include("logged out");
        expect(next).not.to.have.been.called;
    })

    it("should throw an error if token is expired", async () => {
        sinon.stub(jwt, "verify").throws(new Error("Token expired"))

        await jwtAuthMiddleware(req, res, next);

        expect(res.statusCode).to.be.eq(401);
        expect(res._getData()).to.include("expired");
        expect(next).not.to.have.been.called
    })
})
 