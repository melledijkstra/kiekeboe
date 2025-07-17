import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { FocusSession } from '../types';

@Injectable()
export class FocusSessionsService {
  constructor(private readonly db: DatabaseService) {}

  findAll(): Promise<FocusSession[]> {
    return this.db.db<FocusSession>('focus-sessions').select('*');
  }

  async create(data: { duration: number; task: string }): Promise<FocusSession> {
    const [session] = await this.db
      .db<FocusSession>('focus-sessions')
      .insert(data)
      .returning('*');
    return session;
  }

  async update(
    id: number,
    data: { duration: number; task: string },
  ): Promise<FocusSession | null> {
    const [session] = await this.db
      .db<FocusSession>('focus-sessions')
      .where({ id })
      .update(data)
      .returning('*');
    return session ?? null;
  }

  findOne(id: number): Promise<FocusSession | undefined> {
    return this.db
      .db<FocusSession>('focus-sessions')
      .select('*')
      .where({ id })
      .first();
  }

  async remove(id: number): Promise<boolean> {
    const deleted = await this.db
      .db<FocusSession>('focus-sessions')
      .where({ id })
      .del();
    return deleted > 0;
  }
}
