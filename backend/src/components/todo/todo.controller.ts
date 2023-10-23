import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { TodoEntity } from './todo.entity';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @UseGuards(AuthGuard)
  @Post()
  async create(@Req() req:Request,@Body() body) {
    return this.todoService.create(req['user_data'].id,body.task);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAll(@Req() req: Request):Promise<TodoEntity[]> {
    const userId = req['user_data'].id;
    return this.todoService.getAll(Number(userId));
  }


  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('completed') completed: boolean,
    @Body('task') task: string,
    @Req() req: Request,
  ) {
    const userId = req['user_data'].id;
    return this.todoService.update(Number(id), Number(userId), completed, task);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req: Request) {
    const userId = req['user_data'].id;
    return this.todoService.delete(Number(id), Number(userId));
  }

  @UseGuards(AuthGuard)
  @Delete()
  async deleteAll(@Req() req: Request) {
    const userId = req['user_data'].id;
    return this.todoService.deleteAll(userId);
  }

 

  
}
