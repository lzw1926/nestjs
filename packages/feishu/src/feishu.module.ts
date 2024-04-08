import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import {
  FEISHU_MODULE_CONFIG_TOKEN,
  HTTP_CLIENT_TOKEN,
} from './feishu.constant';
import { InjectFeishuModuleConfig } from './feishu.decorators';
import { FeishuProvider } from './feishu.provider';
import { FeishuModuleConfig } from './feishu.interface';
import { FeishuBotService } from './bot.service';
import { HttpModule } from '@nestjs/axios';

@Module({})
export class FeishuModule
  extends createConfigurableDynamicRootModule<FeishuModule, FeishuModuleConfig>(
    FEISHU_MODULE_CONFIG_TOKEN,
    {
      imports: [HttpModule],
      providers: [FeishuProvider, FeishuBotService, HttpModule],
      exports: [
        FEISHU_MODULE_CONFIG_TOKEN,
        HTTP_CLIENT_TOKEN,
        FeishuBotService,
      ],
    }
  )
  implements OnModuleInit
{
  private readonly logger = new Logger(FeishuModule.name);
  private static botService: FeishuBotService;
  constructor(
    private readonly externalContextCreator: ExternalContextCreator,
    @InjectFeishuModuleConfig()
    private readonly feishuModuleConfig: FeishuModuleConfig,
    private readonly feishuBotService: FeishuBotService
  ) {
    super();
    FeishuModule.botService = this.feishuBotService;
  }

  public async onModuleInit() {
    if (!this.feishuModuleConfig.botId) {
      this.logger.error('botId is required');
      throw new Error('botId is required');
    }
  }

  public static getFeishuService() {
    return FeishuModule.botService;
  }
}
