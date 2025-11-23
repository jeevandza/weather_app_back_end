import { Sequelize } from "sequelize";
import dotenv from "dotenv";


const sequelize = new Sequelize(
  "postgres",     
  "postgres",   
  "admin@123",     
  {
    host: "localhost",
    dialect: "postgres",
    port:  5433,
    logging: false,        
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: false,   
      freezeTableName: true, 
    },
  }
);

export default sequelize;
