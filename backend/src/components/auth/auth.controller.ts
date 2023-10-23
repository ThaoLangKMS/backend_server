import { Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
    async register(@Body() reqBody) {
      return this.authService.register(reqBody.email, reqBody.password);
    }

  @Post('login') 
  @UsePipes(ValidationPipe)
   async login(@Body() reqBody:LoginUserDto) {    
    return this.authService.login(reqBody);
  }

  @Post('refresh-token')
  refreshToken(@Body(){refresh_token}):Promise<any>{
    return this.authService.refreshToken(refresh_token);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
      return req.user;
  }

  // @Post('google-login')
  // async googleLogin(@Body() { idToken }: { idToken: string }) {
  //   // Sử dụng Firebase Admin SDK để xác thực idToken
  //   const userId = await this.authService.verifyGoogleIdToken(idToken);
    
  //   // Sau khi xác thực thành công, bạn có thể tạo hoặc đăng nhập người dùng và tạo token trả về cho ứng dụng React Native.
  // }

  // @Get()
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req) { }

  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // googleAuthRedirect(@Req() req) {
  //   return this.authService.googleLogin(req)
  // }
}
