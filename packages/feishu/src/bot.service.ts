import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectFeishuWebhookClient } from './feishu.decorators';
import { firstValueFrom } from 'rxjs';

type MessageOptions = {
  env: 'production' | 'development' | 'test';
  path?: string;
  uid?: string;
  reqId?: string;
};
@Injectable()
export class FeishuBotService {
  constructor(
    @InjectFeishuWebhookClient()
    private readonly botWebhook: HttpService
  ) {}

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
    return data;
  }

  public async sendCardMsg(content: Record<any, any>, options: MessageOptions) {
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
                    content: `**接口路径:** ${options.path ?? ''}`,
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
                    content: `**请求ID:** ${options.reqId ?? ''}`,
                    tag: 'lark_md',
                  },
                },
                {
                  is_short: true,
                  text: {
                    content: '**uid:**',
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
            template: options.env === 'production' ? 'red' : 'yellow',
            title: {
              content:
                options.env === 'production' ? '🚨 日志告警' : '测试莫慌',
              tag: 'plain_text',
            },
          },
        },
      })
    );
    return data;
  }
}
