import { Knex } from 'knex';
import ObjectID from 'bson-objectid';
import { IMap } from '@shared/interfaces/util';
import { InjectKnex } from 'nestjs-knex';

export interface IBaseQuery<T> {
  getById(id: string, columns?: string[]): Promise<T>;
  updateById(id: string, value: T): Promise<T>;
  insert(value: T, returning?: string[]): Promise<T>;
  insertWithTransaction(
    trx: Knex.Transaction,
    value: T,
    returning?: string[],
  ): Promise<T[]>;
  updateByIdWithTransaction(
    trx: Knex.Transaction,
    id: string,
    value: T,
  ): Promise<T[]>;
  getByIdWithTransaction(
    trx: Knex.Transaction,
    id: string,
    columns?: string[],
  ): Promise<T>;
}

type IdClass = { id: string };

export class BaseRepo<T extends Partial<IdClass>> implements IBaseQuery<T> {
  @InjectKnex() _knex;

  get knex() {
    if (this.schema) return this._knex.withSchema(this.schema);
    return this._knex;
  }

  get tableName(): string {
    return this._tableName;
  }

  constructor(private _tableName: string, private schema?: string) {}

  generateRecordId() {
    return new ObjectID().toString();
  }

  getAll(where?, columns = ['*'], sort?, order = 'asc') {
    const query = this.knex.select(columns).from(this._tableName);
    if (where) query.where(where);
    if (sort) query.orderBy(sort, order);
    return query;
  }

  getOne(where, columns = ['*']) {
    return this.getAll(where, columns).clone().first();
  }

  getById(id: string, columns = ['*']): Promise<T> {
    return this.knex
      .select(columns)
      .from(this._tableName)
      .where('id', id)
      .first();
  }

  async updateById(id: string, value: Partial<T>, returning = ['*']): Promise<T> {
    const [data] = await this._knex(this._tableName)
      .update(value)
      .where('id', id)
      .returning(returning);
    return data;
  }

  async insert(
    value: T,
    returning = ['*'],
    disableId?,
  ): Promise<T> {
    const values = disableId
      ? { ...value }
      : value.id
        ? { ...value }
        : { ...value, id: this.generateRecordId() };
    const [data] = await this.knex
      .insert(values)
      .into(this._tableName)
      .returning(returning);
    return data;
  }

  async insertWithTransaction(
    trx: Knex.Transaction,
    value: T,
    returning = ['*'],
    disableId = false,
  ) {
    const values = disableId
      ? { ...value }
      : value.id
        ? { ...value }
        : { ...value, id: this.generateRecordId() };
    const [data] = await trx
      .insert(values)
      .into(this._tableName)
      .returning(returning);
    return data?.length > 1 ? data[0] : data;
  }

  async updateByIdWithTransaction(
    trx: Knex.Transaction,
    id: string,
    value: Partial<T>,
    returning = ['*'],
  ) {
    const [data] = await trx
      .update(value)
      .from(this._tableName)
      .where('id', id)
      .returning(returning);
    return data;
  }

  getByIdWithTransaction(
    trx: Knex.Transaction,
    id: string,
    columns = ['*'],
  ): Promise<T> {
    return trx.select(columns).from(this._tableName).where('id', id).first();
  }

  async delete(whereMap: IMap, returning = ['*'], trx?) {
    const client = trx ? trx : this.knex;
    const [data] = await client
      .from(this._tableName)
      .where(whereMap)
      .del()
      .returning(returning);
    return data;
  }
}
