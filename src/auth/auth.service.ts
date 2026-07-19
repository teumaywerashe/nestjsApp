import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { PublicUser, UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';

export interface AuthSession {
  user: PublicUser;
  token: string;
}

@Injectable()
export class AuthService {
  private readonly sessions = new Map<string, number>();

  constructor(private readonly userService: UserService) {}

  register(createUserDto: CreateUserDto): AuthSession {
    const user = this.userService.create(createUserDto);
    return this.createSession(user);
  }

  login(loginDto: LoginDto): AuthSession {
    const user = this.userService.validateCredentials(
      loginDto.email,
      loginDto.password,
    );
    return this.createSession(user);
  }

  validateToken(token: string): PublicUser {
    const userId = this.sessions.get(token);

    if (!userId) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return this.userService.findOne(userId);
  }

  private createSession(user: PublicUser): AuthSession {
    const token = randomUUID();
    this.sessions.set(token, user.id);

    return {
      user,
      token,
    };
  }
}
