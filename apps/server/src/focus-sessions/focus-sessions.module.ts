import { Module } from '@nestjs/common';
import { FocusSessionsService } from './focus-sessions.service';
import { FocusSessionsController } from './focus-sessions.controller';
import { DatabaseModule } from '../database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FocusSessionsController],
  providers: [FocusSessionsService],
})
export class FocusSessionsModule {}
