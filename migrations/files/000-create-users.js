const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  await queryInterface.createTable('users', {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    email: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('users');
}

module.exports = { up, down };
