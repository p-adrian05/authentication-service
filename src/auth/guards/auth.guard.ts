import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../users/service/users.service';

declare global {
  interface Headers {
    authorization?: string;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService,
              private configService: ConfigService,
              private reflector: Reflector,
              private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is public
    if (this.isPublicRoute(context)) {
      return true;
    }
    // Extract the token from the request header
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Invalid or missing token');
    }
    let payload = await this.verifyToken(token);
    // Attach the user to the request object
    const user = await this.userService.findById(payload.sub);
    if(!user){
      throw new UnauthorizedException('The user belonging to this token does no longer exist');
    }
    if(!user.active){
      throw new UnauthorizedException('User is not active');
    }
    request['currentUser'] = user;
    return true;
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
  private async verifyToken(token: string): Promise<any>{
    let payload;
    try {
      // Verify the token
      payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        }
      );
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
    return payload;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}