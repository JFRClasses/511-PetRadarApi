import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUserDto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService
    ){}

    async login(email:string, password: string){
        const id = await this.usersService.validate(email,password);
        return id;
    }

    async register(dto:CreateUserDto){
        const id = await this.usersService.create(dto);
        return id;
    }
}
