/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('wallets', function (table) {
    table.increments('id').unsigned();
    table.integer('balance').defaultTo(0);
    table.string('account_number').unique();
    table.integer('user_id').unsigned().nullable().unique();
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.timestamps(true, true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('wallets');
};
