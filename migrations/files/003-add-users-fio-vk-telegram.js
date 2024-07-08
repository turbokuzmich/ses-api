const { Sequelize, QueryInterface } = require('sequelize');

async function up({ context }) {
  /**
   * @type {QueryInterface}
   */
  const queryInterface = context;

  await queryInterface.addColumn('users', 'fio', Sequelize.STRING);
  await queryInterface.addColumn('users', 'vk', Sequelize.STRING);
  await queryInterface.addColumn('users', 'telegram', Sequelize.STRING);
}

async function down({ context }) {
  /**
   * @type {QueryInterface}
   */
  const queryInterface = context;

  await queryInterface.removeColumn('users', 'fio');
  await queryInterface.removeColumn('users', 'fk');
  await queryInterface.removeColumn('users', 'telegram');
}

module.exports = { up, down };
