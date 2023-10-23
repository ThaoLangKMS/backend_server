import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { TodoEntity } from './todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private todoRepository: Repository<TodoEntity>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
  ) {}

  async getAll(userId: number): Promise<TodoEntity[]> {
    return this.todoRepository.find({ where: { user: { id: userId } } });
  }
  
  async create(userId:number, task: string): Promise<TodoEntity> {
    const user =await this.userRepository.findOneBy({id:userId});

    try{
      const res=await this.todoRepository.save({
        task,user
      })

      return await this.todoRepository.findOneBy({id:res.id});
    }catch(error){
      throw new HttpException('Can not create todo task',HttpStatus.BAD_REQUEST);
    }
  }

  async update(todoId: number, userId: number, completed: boolean, task: string): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ 
      where: { id: todoId, user: { id: userId } } 
    });
    if (!todo) {
      throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
    }
    todo.completed = completed;
    todo.task = task;
    return this.todoRepository.save(todo);
  }
  
  async delete(todoId: number, userId: number): Promise<void> {
    const result = await this.todoRepository.delete({ id: todoId, user: { id: userId } });
    if (result.affected === 0) {
      throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteAll(userId: number): Promise<void> {
    await this.todoRepository.delete({ user: { id: userId } });
  }
}
