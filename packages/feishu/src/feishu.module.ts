import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
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
      imports: [DiscoveryModule, HttpModule],
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

  constructor(
    private readonly discover: DiscoveryService,
    private readonly externalContextCreator: ExternalContextCreator,
    @InjectFeishuModuleConfig()
    private readonly feishuModuleConfig: FeishuModuleConfig
  ) {
    super();
  }

  public async onModuleInit() {
    if (!this.feishuModuleConfig.botId) {
      this.logger.error('botId is required');
      throw new Error('botId is required');
    }
  }
}
