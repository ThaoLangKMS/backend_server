import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { error } from 'console';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/users.entity';
import { UserService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(UserEntity) private userRepository:Repository<UserEntity>,
    private userService: UserService,
    private jwtService: JwtService,
    private configService:ConfigService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(loginUserDto:LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
        where: { email: loginUserDto.email }
    });

    if (!user) {
        throw new HttpException("Email is not exist", HttpStatus.UNAUTHORIZED);
    }
    
    const isPasswordCorrect = await bcrypt.compare(loginUserDto.password, user.password);

    if (!isPasswordCorrect) {
        throw new HttpException("Password is not correct", HttpStatus.UNAUTHORIZED);
    }

    const payload = { email: user.email, id: user.id };
    return this.generateToken(payload);
}

async refreshToken(refresh_token:string):Promise<any>{
  try{
    const verify=await this.jwtService.verifyAsync(refresh_token,{
      secret:this.configService.get<string>('SECRET')
    })

    const checkExistToken=await this.userRepository.findOneBy({email:verify.email,refresh_token});
    if (checkExistToken){
      return this.generateToken({id:verify.id,email:verify.email});
    }
    else{
      throw new HttpException("Refresh token is not valid",HttpStatus.BAD_REQUEST);
    }
    
  }catch(error){
      throw new HttpException('Resfresh token is not valid',HttpStatus.BAD_REQUEST)
  }
}


  async register(email:string, password:string) {
    if (!password){
      throw error;
    }

    const hashPassword = await this.hashPassword(password);
    let response = await this.userService.create(email,hashPassword);
    if (response) {
        const { password, ...result } = response;
        return result;
    }
}

  decodeToken(token) : any {
    return this.jwtService.decode(token)
  }

  private async generateToken(payload:{id:number,email:string}){
    const access_token=await this.jwtService.signAsync(payload);
    const refresh_token=await this.jwtService.signAsync(payload,{
      secret:this.configService.get<string>('SECRET'),
      expiresIn:this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
    })

    await this.userRepository.update(
      {email:payload.email},
      {refresh_token:refresh_token}
    )

    return {access_token,refresh_token};
  }

  private async hashPassword(password:string):Promise<string>{
    const saltRound=10;
    const salt=await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }
    return {
      message: 'User Info from Google',
      user: req.user
    }
  }

  async verifyGoogleToken(idToken: string): Promise<string | null> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      // Sử dụng decodedToken để kiểm tra và xác thực người dùng.
      // Trả về một mã thông báo hoặc thông tin người dùng đã xác thực.
      return decodedToken.uid;
    } catch (error) {
      console.error('Lỗi xác thực Firebase:', error);
      return null;
    }
  }
}



