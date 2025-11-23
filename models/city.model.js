import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import Country from "./country.model.js";

const City = sequelize.define(
  "City",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Country,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    lon: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: "cities",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["name", "countryId"],
      },
    ],
  }
);

Country.hasMany(City, { foreignKey: "countryId", as: "cities" });
City.belongsTo(Country, { foreignKey: "countryId", as: "country" });

export default City;
