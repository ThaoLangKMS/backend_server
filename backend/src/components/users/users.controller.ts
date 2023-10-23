import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { UserEntity } from "./users.entity";
import { UserService } from "./users.service";

@Controller('users')
export class UserController {
    constructor(private readonly userService:UserService){}
    
    @UseGuards(AuthGuard)
    @Get()
    async findAll():Promise<UserEntity[]>{
        try {
            console.log('helu');
            return await this.userService.findAll();
          } catch (error) {
            console.error(error);
            throw error;
          }
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id:string):Promise<UserEntity>{
      return this.userService.findOne(Number(id));
    }
}