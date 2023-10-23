import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService:JwtService, private configService:ConfigService){}

    async canActivate(context:ExecutionContext):Promise<boolean>{
        const request=context.switchToHttp().getRequest();
        const token=this.extractTokenFromHeader(request);
        if(!token){
            console.log("helllu")
            throw new UnauthorizedException();
        }

        try{
            
            const payload= await this.jwtService.verifyAsync(token,{
                secret: this.configService.get<string>('SECRET')
            })
            request['user_data']=payload;
        }catch{
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authHeader = request.headers.authorization;
    
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            return token;
        }
    
        return undefined;
    }
    
}