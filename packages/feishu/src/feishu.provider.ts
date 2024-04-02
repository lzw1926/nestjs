import { Provider } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import {
  FEISHU_MODULE_CONFIG_TOKEN,
  HTTP_CLIENT_TOKEN,
} from './feishu.constant';
import { FeishuModuleConfig } from './feishu.interface';

export const FeishuProvider: Provider = {
  provide: HTTP_CLIENT_TOKEN,
  useFactory: (
    { ...options }: FeishuModuleConfig,
    httpService: HttpService
  ): HttpModule => {
    httpService.axiosRef.defaults.baseURL = `https://open.feishu.cn/open-apis/bot/v2/hook/${options.botId}`;
    httpService.axiosRef.defaults.timeout = 5000;
    return httpService;
  },
  inject: [FEISHU_MODULE_CONFIG_TOKEN, HttpService],
};
