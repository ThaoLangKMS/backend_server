import { TodoEntity } from 'src/components/todo/todo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({unique:true})
  email: string;

  @Column()
  password: string;

  @OneToMany(()=>TodoEntity, todo =>todo.user)
  todos:TodoEntity[];

  @Column({nullable:true,default:null}) 
  refresh_token: string; 
}
