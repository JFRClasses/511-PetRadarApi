import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/CreateUserDto';
import { BodyResponse } from 'src/lost-pets/dtos/body-response.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Post("login")
    async login(){

    }

    @Post("register")
    async register(@Body() dto: CreateUserDto){
        const response : BodyResponse = {
            status: 200,
            error: false,
            errorMessage: undefined,
            data: undefined
        }
        const token = await this.authService.register(dto);
        response.data = {
            token: token
        };
        return response;
    }
}
