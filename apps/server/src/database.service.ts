import { Injectable, OnModuleDestroy } from '@nestjs/common';
import knex, { Knex } from 'knex';
import knexConfig from '../knexfile';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  public readonly db: Knex;

  constructor() {
    this.db = knex(knexConfig.development);
  }

  async onModuleDestroy() {
    await this.db.destroy();
  }
}
