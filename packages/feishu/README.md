# @pixocial/nestjs-feishu

## Usage

### Install

`npm install ---save @pixocial/nestjs-feishu`

or

`pnpm add @pixocial/nestjs-feishu`

### Module Initialization

```typescript
import { Module } from '@nestjs/common';
import { FeishuModule } from '@pixocial/nestjs-feishu';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    FeishuModule.forRootAsync(FeishuModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService<GlobalConfig, true>) {
        return {
          botId: config.get('feishu.bot', { infer: true }),
          env: config.get('runningEnv'),
        };
      },
    }),
  ],
  exports: [FeishuModule],
})
```

### Send Feishu message

#### Injectable Providers

```typescript
import { FeishuBotService, InjectFeishuWebhookClient } from '@pixocial/nestjs-feishu';
import { HttpService } from '@nestjs/axios';

// retrieve the inner FeishuBotService instance to send pre-designed structured messages
constructor(
  private readonly feishuBotService: FeishuBotService,
) {

  this.feishuBotService.sendCardMsg({ message: 'Hello, World!' }, options);
}

/// or

// injects the http client instantiated with your bot configurations which can be used to make API calls directly
@InjectFeishuWebhookClient() feishuHttpClient: HttpService,
```
