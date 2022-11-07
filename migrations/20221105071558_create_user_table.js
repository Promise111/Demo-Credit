const { table } = require('console');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary().unsigned();
    table.uuid('uuid');
    table.string('firstName', 255).notNullable();
    table.string('lastName', 255).notNullable();
    table.string('email').unique().notNullable();
    table.text('password').notNullable();
    table.timestamps(true, true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable(users);
};
