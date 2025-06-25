import { userDetailsValidator, validtaPassword } from "../src/utills/userValidator.js";

import * as chai from "chai";
const expect = chai.expect;

describe("In userDetailsValidator function", () => {
  it("should return an error message if Username is empty", () => {
    const result = userDetailsValidator("", "harshita@gmail.com", "1234567890");
    expect(result).to.be.eq("Username is Mandatory");
  });

  it("should return an error message if Email is empty", () => {
    const result = userDetailsValidator("harshita", "", "1234567890");
    expect(result).to.be.eq("Email is Mandatory");
  });

  it("should return an error message if Phone no is empty", () => {
    const result = userDetailsValidator("harshita", "harshita@gmail.com", "");
    expect(result).to.be.eq("Phone Number is Mandatory");
  });

  it("should return an error message if Phone no is invalid", () => {
    const result = userDetailsValidator(
      "harshita",
      "harshita@gmail.com",
      "12345678"
    );
    expect(result).to.be.eq("Invalid PhoneNo");
  });

  it("should return an error message if Phone no is invalid", () => {
    const result = userDetailsValidator(
      "harshita",
      "harshita@gmail.com",
      "string"
    );
    expect(result).to.be.eq("Invalid PhoneNo");
  });
  it("should return an error message if Phone no is invalid", () => {
    const result = userDetailsValidator(
      "harshita",
      "harshita@gmail.com",
      "@#123+"
    );
    expect(result).to.be.eq("Invalid PhoneNo");
  });

  it("should return an error message if Username is invalid", () => {
    const result = userDetailsValidator("hi", "harshita@gmail.com", "1234567890");
    expect(result).to.be.eq("Username length must be more than or equal to 3 and should be all charcter");
  });
  it("should return an error message if Username is invalid", () => {
    const result = userDetailsValidator("1234", "harshita@gmail.com", "1234567890");
    expect(result).to.be.eq("Username length must be more than or equal to 3 and should be all charcter");
  });

  it("should return an error message if Email is invalid", () => {
    const result = userDetailsValidator(
      "harshita",
      "harshita@gmail.",
      "1234567890"
    );
    expect(result).to.be.eq("Email format is not proper");
  });

  it("should return an error message if Email is invalid", () => {
    const result = userDetailsValidator(
      "harshita",
      "harshitagmail.com",
      "1234567890"
    );
    expect(result).to.be.eq("Email format is not proper");
  });
  it("should return an error message if Email is invalid", () => {
    const result = userDetailsValidator(
      "harshita",
      "@gmail.com",
      "1234567890"
    );
    expect(result).to.be.eq("Email format is not proper");
  });
  it("should return an error message if Email is invalid", () => {
    const result = userDetailsValidator(
      "harshita",
      "harshita @gmail.com",
      "1234567890"
    );
    expect(result).to.be.eq("Email format is not proper");
  });
  it("should return an error message if Email is invalid", () => {
    const result = userDetailsValidator(
      "harshita",
      "harshita..c.@gmail.com",
      "1234567890"
    );
    expect(result).to.be.eq("Email format is not proper");
  });
  it("should return an error message if Email is invalid", () => {
    const result = userDetailsValidator(
      "harshita",
      "harshita#$gmail.com",
      "1234567890"
    );
    expect(result).to.be.eq("Email format is not proper");
  });
  it("should return an error message if Email is invalid", () => {
    const result = userDetailsValidator(
      "harshita",
      "harshita@gmail.c",
      "1234567890"
    );
    expect(result).to.be.eq("Email format is not proper");
  });
  it("should return null if every field is filled and valid", () => {
    const result = userDetailsValidator(
      "HARSHITA",
      "Harshita@gmail.com",
      "1234567890"
    );
    expect(result).to.be.eq(null);
  });

  it("should return null if every field is filled and valid", () => {
    const result = userDetailsValidator("harshita",
      "harshita@gmail.com",
      "1234567890")
      expect(result).to.be.eq(null);
  })
});


describe("In validatePassword function", () => {
    it("should return an error message if password is empty", () => {
        const result = validtaPassword("");
        expect(result).to.be.eq("Password is mandatory");
    })
    it("should return an error message if password is not proper", () => {
        const result = validtaPassword("ha");
        expect(result).to.be.eq("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
    })
    it("should return an error message if password is not proper", () => {
        const result = validtaPassword("harshita");
        expect(result).to.be.eq("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
    })
    it("should return an error message if password is not proper", () => {
        const result = validtaPassword("Harshita@");
        expect(result).to.be.eq("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
    })
    it("should return an error message if password is not proper", () => {
        const result = validtaPassword("@");
        expect(result).to.be.eq("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
    })
    it("should return null message if password is proper", () => {
        const result = validtaPassword("Harsh1t@#123");
        expect(result).to.be.eq(null);
    })
})