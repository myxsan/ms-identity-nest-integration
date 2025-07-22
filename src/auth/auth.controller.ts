import { Controller, Get, Req, Res, Query } from '@nestjs/common';
import { Request, Response } from 'express';
import { AccountInfo } from '@azure/msal-node';
import { MsalService } from './msal.service';

// Extend the Express Request type to include session
declare module 'express-session' {
  interface SessionData {
    account?: AccountInfo;
    accessToken?: string;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly msalService: MsalService) {}

  @Get('signin')
  async signIn(@Req() req: Request, @Res() res: Response) {
    const scopes = ['user.read'];
    try {
      const authCodeUrl = await this.msalService.getAuthCodeUrl(scopes);
      res.redirect(authCodeUrl);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error during authentication');
    }
  }

  @Get('redirect')
  async redirect(
    @Query('code') code: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!code) {
      return res.status(400).send('Authorization code not found');
    }

    const scopes = ['user.read'];
    try {
      const tokenResponse = await this.msalService.acquireTokenByCode(
        code,
        scopes,
      );

      // Store user information in session
      if (tokenResponse.account) {
        req.session.account = tokenResponse.account;
      }
      req.session.accessToken = tokenResponse.accessToken;

      res.redirect('/profile'); // Redirect to protected route
    } catch (error) {
      console.error(error);
      res.status(500).send('Error during token acquisition');
    }
  }

  @Get('signout')
  signOut(@Req() req: Request, @Res() res: Response) {
    const account = req.session.account;

    if (account) {
      const logoutUri = this.msalService.getLogoutUri(account);
      req.session.destroy((err) => {
        if (err) {
          console.error(err);
        }
      });
      res.redirect(logoutUri);
    } else {
      res.redirect('/');
    }
  }
}
