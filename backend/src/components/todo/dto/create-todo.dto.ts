import { IsString } from "class-validator";
import { UserEntity } from "src/components/users/users.entity";

export class CreateTodoDto{
    @IsString()
    task: string;

    
    user: UserEntity
}