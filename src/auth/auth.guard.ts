import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from './token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private tokenService: TokenService){}

  async canActivate(
    context: ExecutionContext,
  ){
    const request = context.switchToHttp().getRequest()
    const token = request.headers.authorization?.replace("Bearer ","");
    const userId = await this.tokenService.getUserId(token);
    request.userId = userId;
    return true;
  }
}

//REDIS ES UNA BASE DE DATOS CLAVE VALOR
// "name":"juan",
// "pet":"{"name":"juan"}"
// "pets":"[{"name":"juan"}]"
