import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

const { DataTypes } = Sequelize;

const Attendance = db.define(
  "attendance",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    check_in_time: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    check_out_time: {
      type: DataTypes.TIME,
      allowNull: true,
      validate: {
        notEmpty: false,
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [0, 255], 
        isUrlOrEmpty(value) {
          if (value && typeof value === "string" && value.trim() === "") {
            throw new Error("Image cannot be an empty string");
          }
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [["Developer", "Accounting", "Human Resources"]],
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

Users.hasMany(Attendance);
Attendance.belongsTo(Users, { foreignKey: "userId" });

export default Attendance;
