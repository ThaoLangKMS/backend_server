import { UserEntity } from 'src/components/users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TodoEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  task: string;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(type=>UserEntity,user=>user.todos)
  user :UserEntity;
}
