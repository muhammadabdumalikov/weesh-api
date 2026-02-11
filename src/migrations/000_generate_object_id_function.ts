import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    create or replace function generate_object_id() returns character varying
        language plpgsql as $$
    DECLARE
        time_component bigint;
        machine_id     bigint  := FLOOR(random() * 16777215);
        process_id     bigint;
        seq_id         bigint  := FLOOR(random() * 16777215);
        result         varchar := '';
    BEGIN
        SELECT FLOOR(EXTRACT(EPOCH FROM clock_timestamp())) INTO time_component;
        SELECT pg_backend_pid() INTO process_id;
        result := result || lpad(to_hex(time_component), 8, '0');
        result := result || lpad(to_hex(machine_id), 6, '0');
        result := result || lpad(to_hex(process_id), 4, '0');
        result := result || lpad(to_hex(seq_id), 6, '0');
        RETURN result;
    END;
    $$;
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`drop function if exists generate_object_id();`);
}
