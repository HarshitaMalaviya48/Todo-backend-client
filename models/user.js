"use strict";
const { Model } = require("sequelize");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    generateToken = async () => {
      try {
        return jwt.sign(
          {
            userId: this.id,
            userName: this.userName,
            email: this.email,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "8h" }
        );
      } catch (err) {
        console.error(err);
      }
    };

    static associate(models) {
      // define association here
    }
  }
  user.init(
    {
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phoneNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "user",
    }
  );

  return user;
};
