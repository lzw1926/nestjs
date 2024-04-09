import { HttpService } from '@nestjs/axios';
import { Injectable, LoggerService, Logger } from '@nestjs/common';
import {
  InjectFeishuModuleConfig,
  InjectFeishuWebhookClient,
} from './feishu.decorators';
import { firstValueFrom } from 'rxjs';
import { FeishuModuleConfig } from './feishu.interface';

type MessageOptions = {
  env?: FeishuModuleConfig['env'];
  path?: string;
  uid?: string;
  traceId?: string;
};
@Injectable()
export class FeishuBotService {
  private readonly logger: LoggerService;
  private readonly defaultMessageOptions: MessageOptions;
  constructor(
    @InjectFeishuWebhookClient()
    private readonly botWebhook: HttpService,
    @InjectFeishuModuleConfig()
    private readonly feishuModuleConfig: FeishuModuleConfig
  ) {
    this.defaultMessageOptions = {
      env: this.feishuModuleConfig?.env,
    };
    this.logger =
      this.feishuModuleConfig?.logger || new Logger(FeishuBotService.name);
    this.botWebhook.axiosRef.interceptors.response.use(
      (response) => response,
      (error) => {
        this.logger.error({ message: 'feishu bot error', error });
        return Promise.reject(error);
      }
    );
  }

  public async sendPlainMsg(title: string, content: string | string[]) {
    const msg = Array.isArray(content) ? content : [content];
    const { data } = await firstValueFrom(
      this.botWebhook.post('/', {
        msg_type: 'post',
        content: {
          post: {
            zh_cn: {
              title,
              content: [
                msg.map((content) => ({
                  tag: 'text',
                  text: content,
                })),
              ],
            },
          },
        },
      })
    );
    this.logger.log({ message: 'feishu plain text message sent', data });
    return data;
  }

  public async sendCardMsg(
    content: Record<any, any>,
    options?: MessageOptions
  ) {
    options = { ...this.defaultMessageOptions, ...options };
    const { data } = await firstValueFrom(
      this.botWebhook.post('/', {
        msg_type: 'interactive',
        card: {
          config: {
            wide_screen_mode: true,
          },
          elements: [
            {
              fields: [
                {
                  is_short: true,
                  text: {
                    content: `🕐 **时间:** ${new Date().toLocaleString(
                      'zh-CN',
                      {
                        timeZone: 'Asia/Shanghai',
                      }
                    )}`,
                    tag: 'lark_md',
                  },
                },
                {
                  is_short: true,
                  text: {
                    content: `**接口路径:** ${options?.path ?? ''}`,
                    tag: 'lark_md',
                  },
                },
                {
                  is_short: true,
                  text: {
                    content: '',
                    tag: 'lark_md',
                  },
                },
                {
                  is_short: true,
                  text: {
                    content: '',
                    tag: 'lark_md',
                  },
                },
                {
                  is_short: true,
                  text: {
                    content: `**traceId:** ${options?.traceId ?? ''}`,
                    tag: 'lark_md',
                  },
                },
                {
                  is_short: true,
                  text: {
                    content: `**uid:** ${options?.uid ?? ''}`,
                    tag: 'lark_md',
                  },
                },
              ],
              tag: 'div',
            },
            {
              tag: 'hr',
            },
            {
              fields: [
                {
                  is_short: true,
                  text: {
                    content: '**详细内容**',
                    tag: 'lark_md',
                  },
                },
                {
                  is_short: true,
                  text: {
                    content: '',
                    tag: 'lark_md',
                  },
                },
                {
                  is_short: true,
                  text: {
                    content: JSON.stringify(content, null, 2),
                    tag: 'lark_md',
                  },
                },
              ],
              tag: 'div',
            },
          ],
          header: {
            template: options?.env === 'production' ? 'red' : 'yellow',
            title: {
              content:
                options?.env === 'production' ? '🚨 日志告警' : '测试莫慌',
              tag: 'plain_text',
            },
          },
        },
      })
    );
    this.logger.log({ message: 'feishu card message sent', data });
    return data;
  }
}
