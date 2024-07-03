const { Sequelize, QueryInterface } = require('sequelize');

async function up({ context }) {
  /**
   * @type {QueryInterface}
   */
  const queryInterface = context;

  await queryInterface.createTable('posts', {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
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

  await queryInterface.addConstraint('posts', {
    type: 'foreign key',
    fields: ['userId'],
    name: 'fk_posts__userid',
    references: {
      table: 'users',
      field: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('posts');
}

module.exports = { up, down };
