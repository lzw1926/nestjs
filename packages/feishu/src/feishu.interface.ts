import { type LoggerService } from '@nestjs/common';

export interface FeishuModuleConfig {
  botId: string;
  chat?: string | Array<string>;
  logger?: LoggerService;
  env?: 'production' | 'development' | 'test';
}
