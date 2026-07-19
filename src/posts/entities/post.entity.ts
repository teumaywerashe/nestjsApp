import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column()
  declare title: string;

  @Column()
  declare content: string;

  @Column()
  declare authorId: number;

  @Column()
  declare createdAt: Date;
}
