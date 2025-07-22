import { AccountInfo } from '@azure/msal-node';

declare module 'express-session' {
  interface SessionData {
    account?: AccountInfo;
    accessToken?: string;
  }
}
