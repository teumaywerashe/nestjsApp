import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthTokenGuard } from './auth-token.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, AuthTokenGuard],
  exports: [AuthService, AuthTokenGuard],
})
export class AuthModule {}
