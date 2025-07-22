import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as session from 'express-session';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { AppController } from './app.controller'; // Add this
import { MsalService } from './auth/msal.service';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController, AuthController, UserController], // Add AppController
  providers: [MsalService, AuthGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: process.env.SESSION_SECRET || 'fallback-secret-key',
          resave: false,
          saveUninitialized: false,
          cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
          },
        }),
      )
      .forRoutes('*');
  }
}
