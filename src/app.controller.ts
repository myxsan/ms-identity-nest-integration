import { Controller, Get, Req, Render } from '@nestjs/common';
import { Request } from 'express';

@Controller()
export class AppController {
  @Get()
  @Render('home')
  getHome(@Req() req: Request) {
    const account = req.session?.['account'];
    return {
      title: 'Home',
      user: account
        ? {
            name: account.name,
            username: account.username,
            homeAccountId: account.homeAccountId,
          }
        : null,
    };
  }
}
