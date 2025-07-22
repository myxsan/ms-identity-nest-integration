import { Controller, Get, Req, UseGuards, Render } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Controller()
@UseGuards(AuthGuard)
export class UserController {
  @Get('profile')
  @Render('profile')
  getProfile(@Req() req: Request) {
    const account = req.session['account'];
    return {
      title: 'Profile',
      user: {
        name: account?.name,
        username: account?.username,
        homeAccountId: account?.homeAccountId,
      },
      loginTime: new Date().toLocaleString(),
    };
  }

  @Get('id')
  @Render('id')
  getId(@Req() req: Request) {
    const account = req.session['account'];
    return {
      title: 'ID Token',
      claims: account?.idTokenClaims || {},
    };
  }
}
