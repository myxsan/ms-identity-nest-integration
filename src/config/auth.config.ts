import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogLevel } from '@azure/msal-node';

@Injectable()
export class AuthConfigService {
  constructor(private configService: ConfigService) {}

  getAuthConfig() {
    return {
      auth: {
        authority: `https://login.microsoftonline.com/${this.configService.get('AZURE_TENANT_ID')}`,
        clientId: this.configService.get<string>('AZURE_CLIENT_ID'),
        clientSecret: this.configService.get<string>('AZURE_CLIENT_SECRET'),
        redirectUri: 'http://localhost:3000/auth/redirect',
      },
      system: {
        loggerOptions: {
          loggerCallback: (
            logLevel: LogLevel,
            message: string,
            containsPii: boolean,
          ) => {
            if (containsPii) {
              return;
            }
            console.log(message);
          },
          piiLoggingEnabled: false,
          logLevel: 3,
        },
      },
    };
  }
}
