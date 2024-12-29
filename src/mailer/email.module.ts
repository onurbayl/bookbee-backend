import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
        useFactory: (configService: ConfigService) => ({
          transport: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: configService.get<string>('EMAIL_SERVICE_MAIL'),
                pass: configService.get<string>('EMAIL_SERVICE_APP_PASS'),
            },
          },
        }),
        inject: [ConfigService],
      }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}