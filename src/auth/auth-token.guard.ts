import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PublicUser } from '../user/user.service';
import { AuthService } from './auth.service';

export type AuthenticatedRequest = Request & {
  user: PublicUser;
};

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    request.user = this.authService.validateToken(token);
    return true;
  }

  private extractToken(headerValue?: string | string[]): string | null {
    if (!headerValue) {
      return null;
    }

    const authorization = Array.isArray(headerValue)
      ? headerValue[0]
      : headerValue;
    const [scheme, token] = authorization.split(' ');

    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      return null;
    }

    return token;
  }
}
