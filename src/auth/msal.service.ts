import { Injectable } from '@nestjs/common';
import {
  ConfidentialClientApplication,
  AuthenticationResult,
  AccountInfo,
  Configuration,
  LogLevel,
} from '@azure/msal-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MsalService {
  private msalInstance: ConfidentialClientApplication;

  constructor(private configService: ConfigService) {
    const authConfig: Configuration = {
      auth: {
        authority: `https://login.microsoftonline.com/${this.configService.get('AZURE_TENANT_ID')}`,
        clientId: this.configService.get<string>('AZURE_CLIENT_ID') || '',
        clientSecret:
          this.configService.get<string>('AZURE_CLIENT_SECRET') || '',
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

    this.msalInstance = new ConfidentialClientApplication(authConfig);
  }

  getAuthCodeUrl(scopes: string[]): Promise<string> {
    const authCodeUrlParameters = {
      scopes,
      redirectUri: 'http://localhost:3000/auth/redirect',
    };

    return this.msalInstance.getAuthCodeUrl(authCodeUrlParameters);
  }

  async acquireTokenByCode(
    code: string,
    scopes: string[],
  ): Promise<AuthenticationResult> {
    const tokenRequest = {
      code,
      scopes,
      redirectUri: 'http://localhost:3000/auth/redirect',
    };

    return await this.msalInstance.acquireTokenByCode(tokenRequest);
  }

  async acquireTokenSilent(
    account: AccountInfo,
    scopes: string[],
  ): Promise<AuthenticationResult> {
    const silentRequest = {
      account,
      scopes,
    };

    return await this.msalInstance.acquireTokenSilent(silentRequest);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getLogoutUri(_account: AccountInfo): string {
    // Generate logout URL manually since getLogoutUri is not available
    const tenantId = this.configService.get<string>('AZURE_TENANT_ID');
    const postLogoutRedirectUri = encodeURIComponent('http://localhost:3000');
    return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout?post_logout_redirect_uri=${postLogoutRedirectUri}`;
  }
}
