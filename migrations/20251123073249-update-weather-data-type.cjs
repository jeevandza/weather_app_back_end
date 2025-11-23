'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1️⃣ Create ENUM type
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_weather_data_type') THEN
          CREATE TYPE enum_weather_data_type AS ENUM ('current', 'forecast');
        END IF;
      END$$;
    `);

    // 2️⃣ Alter column to ENUM
    await queryInterface.sequelize.query(`
      ALTER TABLE weather
      ALTER COLUMN data_type
      TYPE enum_weather_data_type
      USING data_type::text::enum_weather_data_type
    `);

    // 3️⃣ Set default value
    await queryInterface.sequelize.query(`
      ALTER TABLE weather
      ALTER COLUMN data_type
      SET DEFAULT 'current'
    `);
  },

  async down(queryInterface, Sequelize) {
    // 1️⃣ Revert to string
    await queryInterface.sequelize.query(`
      ALTER TABLE weather
      ALTER COLUMN data_type
      TYPE VARCHAR(255)
      USING data_type::text
    `);

    // 2️⃣ Drop ENUM type
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS enum_weather_data_type;
    `);
  }
};
