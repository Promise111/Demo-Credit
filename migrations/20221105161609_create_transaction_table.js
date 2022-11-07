const { table } = require('console');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('transactions', function (table) {
    table.increments('id').unsigned();
    table.integer('sender_id').unsigned().nullable();
    table
      .foreign('sender_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.integer('receiver_id').unsigned().nullable();
    table
      .foreign('receiver_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.integer('amount').unsigned().notNullable();
    table
      .enu('transaction_type', ['deposit', 'withdrawal', 'transfer'])
      .notNullable();
    table.timestamps(true, true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('transactions');
};
