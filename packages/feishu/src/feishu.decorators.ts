import { makeInjectableDecorator } from '@golevelup/nestjs-common';
import { FEISHU_MODULE_OPTIONS } from './feishu.constant';

/**
 * Injects the Feishu Module config
 */
export const InjectFeishuModuleConfig = makeInjectableDecorator(
  FEISHU_MODULE_OPTIONS
);
