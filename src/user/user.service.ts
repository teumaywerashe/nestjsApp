import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class UserService {
  private readonly users: UserRecord[] = [];
  private nextId = 1;

  create(createUserDto: CreateUserDto): PublicUser {
    if (this.findByEmail(createUserDto.email)) {
      throw new ConflictException('Email is already registered');
    }

    const user: UserRecord = {
      id: this.nextId++,
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
    };

    this.users.push(user);
    return this.toPublicUser(user);
  }

  findAll(): PublicUser[] {
    return this.users.map((user) => this.toPublicUser(user));
  }

  findOne(id: number): PublicUser {
    const user = this.users.find((item) => item.id === id);

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return this.toPublicUser(user);
  }

  findByEmail(email: string): UserRecord | undefined {
    return this.users.find((user) => user.email === email);
  }

  validateCredentials(email: string, password: string): PublicUser {
    const user = this.findByEmail(email);

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.toPublicUser(user);
  }

  update(id: number, updateUserDto: UpdateUserDto): PublicUser {
    const user = this.users.find((item) => item.id === id);

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = this.findByEmail(updateUserDto.email);

      if (existingUser) {
        throw new ConflictException('Email is already registered');
      }
    }

    user.name = updateUserDto.name ?? user.name;
    user.email = updateUserDto.email ?? user.email;
    user.password = updateUserDto.password ?? user.password;

    return this.toPublicUser(user);
  }

  remove(id: number): PublicUser {
    const userIndex = this.users.findIndex((item) => item.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`User #${id} not found`);
    }

    const [removedUser] = this.users.splice(userIndex, 1);
    return this.toPublicUser(removedUser);
  }

  private toPublicUser(user: UserRecord): PublicUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
