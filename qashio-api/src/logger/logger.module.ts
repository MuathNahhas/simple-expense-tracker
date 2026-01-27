import { Module } from '@nestjs/common';
import { LogService } from './logger-service';

@Module({
  exports: [LogService],
  providers: [LogService],
})
export class LoggerModule {}
