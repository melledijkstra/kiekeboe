import { Module } from '@nestjs/common';
import { FocusSessionsModule } from './focus-sessions/focus-sessions.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule, FocusSessionsModule],
})
export class AppModule {}
