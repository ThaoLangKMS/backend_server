// // import { Module } from '@nestjs/common';
// // import { ConfigModule } from '@nestjs/config';
// // import { TypeOrmModule } from '@nestjs/typeorm';
// // import { UserController } from './users.controller';
// // import { UserEntity } from './users.entity';
// // import { UserService } from './users.service';

// // @Module({
// //   imports: [TypeOrmModule.forFeature([UserEntity]),
// //   ConfigModule],
// //   controllers: [UserController],
// //   providers: [UserService],  
// //   exports: [UserService],
  
// // })
// // export class UserModule {}
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserController } from './users.controller';
// import { UserEntity } from './users.entity';
// import { UserService } from './users.service';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([UserEntity]), // Import TypeOrmModule.forFeature with entities
//   ],
//   controllers: [UserController],
//   providers: [UserService], // Remove TypeOrmModule from providers
//   exports: [UserService],
// })
// export class UserModule {}

// users.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './users.controller';
import { UserEntity } from './users.entity';
import { UserService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule, // Import TypeOrmModule.forFeature with entities
  ],
  controllers:[UserController],
  providers: [UserService], // Remove TypeOrmModule from providers
  exports: [UserService],
})
export class UserModule {}
