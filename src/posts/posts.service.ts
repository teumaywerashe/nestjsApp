import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

export interface PostRecord {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicPost {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class PostsService {
  private readonly posts: PostRecord[] = [];
  private nextId = 1;

  create(createPostDto: CreatePostDto, authorId: number): PublicPost {
    const now = new Date();
    const post: PostRecord = {
      id: this.nextId++,
      title: createPostDto.title,
      content: createPostDto.content,
      authorId,
      createdAt: now,
      updatedAt: now,
    };


    this.posts.push(post);
    return this.toPublicPost(post);
  }

  findAll(): PublicPost[] {
    return this.posts.map((post) => this.toPublicPost(post));
  }

  findOne(id: number): PublicPost {
    const post = this.getPostById(id);

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    return this.toPublicPost(post);
  }

  update(
    id: number,
    updatePostDto: UpdatePostDto,
    authorId: number,
  ): PublicPost {
    const post = this.getPostById(id);

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    this.ensureOwner(post, authorId);

    post.title = updatePostDto.title ?? post.title;
    post.content = updatePostDto.content ?? post.content;
    post.updatedAt = new Date();

    return this.toPublicPost(post);
  }

  remove(id: number, authorId: number): PublicPost {
    const index = this.posts.findIndex((post) => post.id === id);

    if (index === -1) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    this.ensureOwner(this.posts[index], authorId);

    const [removedPost] = this.posts.splice(index, 1);
    return this.toPublicPost(removedPost);
  }

  private getPostById(id: number): PostRecord | undefined {
    return this.posts.find((post) => post.id === id);
  }

  private ensureOwner(post: PostRecord, authorId: number): void {
    if (post.authorId !== authorId) {
      throw new ForbiddenException('You can only manage your own post');
    }
  }

  private toPublicPost(post: PostRecord): PublicPost {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }
}
