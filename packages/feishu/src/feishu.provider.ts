import { Provider } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  FEISHU_MODULE_CONFIG_TOKEN,
  HTTP_CLIENT_TOKEN,
} from './feishu.constant';
import { FeishuModuleConfig } from './feishu.interface';
import axios from 'axios';

export const FeishuProvider: Provider = {
  provide: HTTP_CLIENT_TOKEN,
  useFactory: ({ ...options }: FeishuModuleConfig) => {
    return new HttpService(
      axios.create({
        baseURL: `https://open.feishu.cn/open-apis/bot/v2/hook/${options.botId}`,
        timeout: 5000,
      })
    );
  },
  inject: [FEISHU_MODULE_CONFIG_TOKEN, HttpService],
};
