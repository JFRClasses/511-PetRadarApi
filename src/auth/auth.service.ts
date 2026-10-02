import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUserDto';
import { UsersService } from 'src/users/users.service';
import { TokenService } from './token/token.service';
// GUARDS!!!
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private tokenService: TokenService
    ){}

    async login(email:string, password: string){
        const id = await this.usersService.validate(email,password);
        if(!id) throw new BadRequestException("El email o la contraseña no es valido");
        const token = await this.tokenService.generate(id);
        return token;
    }

    async register(dto:CreateUserDto){
        const id = await this.usersService.create(dto);
        const token = await this.tokenService.generate(id);
        return token;
    }
}
