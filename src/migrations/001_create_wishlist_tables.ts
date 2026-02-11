import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('wishlist_users', (table) => {
    table.string('id', 24).primary();
    table.string('login', 32).nullable();
    table.string('password', 64).nullable();
    table.bigInteger('telegram_id').nullable().unique();
    table.string('google_id', 64).nullable().unique();
    table.string('first_name', 255).nullable();
    table.string('last_name', 255).nullable();
    table.string('username', 255).nullable();
    table.text('photo_url').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTableIfNotExists('wishlist_codes', (table) => {
    table.string('id', 24).primary();
    table.string('name', 255).notNullable();
    table.string('owner_id', 24).notNullable();
    table.string('code', 32).notNullable();
  });

  await knex.schema.createTableIfNotExists('wishlist', (table) => {
    table.string('id', 24).primary();
    table.string('title', 255).notNullable();
    table.text('imageurl').nullable();
    table.text('producturl').nullable();
    table.string('owner_id', 24).notNullable();
    table.string('code', 32).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('wishlist');
  await knex.schema.dropTableIfExists('wishlist_codes');
  await knex.schema.dropTableIfExists('wishlist_users');
}
