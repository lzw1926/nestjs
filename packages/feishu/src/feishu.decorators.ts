import { makeInjectableDecorator } from '@golevelup/nestjs-common';
import {
  FEISHU_MODULE_CONFIG_TOKEN,
  HTTP_CLIENT_TOKEN,
} from './feishu.constant';

/**
 * Injects the Feishu Module config
 */
export const InjectFeishuModuleConfig = makeInjectableDecorator(
  FEISHU_MODULE_CONFIG_TOKEN
);

/**
 * Injects the Feishu webhook client
 */
export const InjectFeishuWebhookClient =
  makeInjectableDecorator(HTTP_CLIENT_TOKEN);
