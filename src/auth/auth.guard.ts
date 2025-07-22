import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

interface SessionData {
  account?: any;
}

interface RequestWithSession {
  session?: SessionData;
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithSession>();

    if (request.session && request.session.account) {
      return true;
    }

    throw new UnauthorizedException('User not authenticated');
  }
}
