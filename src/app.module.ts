import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';
import { PostsController } from './posts/posts.controller';

@Module({
  imports: [UserModule, PostsModule],
  controllers: [AppController, PostsController],
  providers: [AppService, PostsService],
})
export class AppModule {}
