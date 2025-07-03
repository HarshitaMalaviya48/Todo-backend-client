import {hashPassword, comparePassword} from "../src/utills/passwordHelper.js"

import * as chai from "chai";
const expect = chai.expect;

describe("In passwordHelper function", () => {
    it("should encrypt and decrypt password successfully", async () => {
        const password = "Harshita@123";
        const encryptedPassword = await hashPassword(password);

        const decryptPassword = await comparePassword(password, encryptedPassword);

        expect(decryptPassword).to.be.eq(true);

    });

    it("should return false if password is not same", async () => {
        let password = "Harshita@123";
        const encryptedPassword = await hashPassword(password);
        password = "Harshita@12"
        const decryptPassword = await comparePassword(password, encryptedPassword);

        expect(decryptPassword).to.be.eq(false);
    });

    it("should return false if password is empty", async () => {
        let password = "Harshita@123";
        const encryptedPassword = await hashPassword(password);
        password = ""
        const decryptPassword = await comparePassword(password, encryptedPassword);

        expect(decryptPassword).to.be.eq(false);
    });
})