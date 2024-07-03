const { Sequelize, Op, QueryInterface } = require('sequelize');

async function up({ context }) {
  /**
   * @type {QueryInterface}
   */
  const queryInterface = context;

  await queryInterface.createTable('subscriptions', {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    friendId: {
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

  await queryInterface.addConstraint('subscriptions', {
    type: 'primary key',
    fields: ['userId', 'friendId'],
    name: 'pk',
  });

  await queryInterface.addConstraint('subscriptions', {
    type: 'foreign key',
    fields: ['userId'],
    name: 'fk_subscriptions__userid',
    references: {
      table: 'users',
      field: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  });

  await queryInterface.addConstraint('subscriptions', {
    type: 'foreign key',
    fields: ['friendId'],
    name: 'fk_subscriptions__friendid',
    references: {
      table: 'users',
      field: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  });

  await queryInterface.addConstraint('subscriptions', {
    type: 'check',
    fields: ['userId'],
    name: 'distinct',
    where: {
      userId: {
        [Op.ne]: {
          [Op.col]: 'friendId',
        },
      },
    },
  });

  await queryInterface.addIndex('subscriptions', ['userId', 'friendId'], {
    name: 'index_subscriptions_userid_friendid',
    unique: true,
    type: 'UNIQUE',
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('subscriptions');
}

module.exports = { up, down };
