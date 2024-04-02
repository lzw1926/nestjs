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

  public async sendMDMessage(content: string) {
    const { data } = await firstValueFrom(
      this.botWebhook.post('/', {
        msg_type: 'post',
        content: {
          post: {
            zh_cn: {
              title: '消息通知',
              content: [
                [
                  {
                    tag: 'text',
                    text: content,
                  },
                  // {
                  //   "tag": "a",
                  //   "text": "请查看",
                  //   "href": "http://www.example.com/"
                  // },
                  // {
                  //   "tag": "at",
                  //   "user_id": "ou_18eac8********17ad4f02e8bbbb"
                  // }
                ],
              ],
            },
          },
        },
      })
    );
    return data;
  }
}
