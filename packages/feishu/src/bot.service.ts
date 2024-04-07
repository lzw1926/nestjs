import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectFeishuWebhookClient } from './feishu.decorators';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FeishuBotService {
  constructor(
    @InjectFeishuWebhookClient()
    private readonly botWebhook: HttpService
  ) {}

  public async alarm(title: string, content: string | string[]) {
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
}
