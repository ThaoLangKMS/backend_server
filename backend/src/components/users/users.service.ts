import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './users.entity';

@Injectable()
export class UserService {  
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }
  

  async findById(id: number): Promise<UserEntity | undefined> {
    return this.userRepository.findOne({where :{id}});
  }

  async create(email: string, password:string):  Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({ where:{email} });
    if(!existingUser){
      const newUser = this.userRepository.create({ email,password });
      return this.userRepository.save(newUser);
    }
    else{
      throw new HttpException('Account already exists', HttpStatus.CONFLICT);
    }
  }


  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.createQueryBuilder("user")
      .select(["user.id", "user.email"]) // Chú ý sử dụng select trên đối tượng QueryBuilder
      .getMany();
  }

  async findOne(id:number):Promise<UserEntity>{
    return await this.userRepository.findOneBy({id});
  }
  
}
