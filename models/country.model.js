import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Country = sequelize.define(
  "Country",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING(3), 
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "countries",
    timestamps: true,
  }
);

export default Country;
