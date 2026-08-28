import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/CreateUserDto';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>
    ){}

    async create(dto:CreateUserDto){
        const exists = await this.userRepository.findOneBy({ email: dto.email });
        if(exists) throw new ConflictException("El email ya esta registrado");
        const hashedPassword = await bcrypt.hash(dto.password,10);

        const user = this.userRepository.create({
            name: dto.name,
            lastName:dto.lastName,
            password: hashedPassword,
            email: dto.email,
            isPetAlertEnabled: dto.isPetAlertEnabled,
            radius: dto.radius,
            location: {
                type: 'Point',
                coordinates:[dto.lon,dto.lat]
            }
        });
        const saved = await this.userRepository.save(user);
        return saved.id;
    }

    async validate(email:string, password: string){
        const user = await this.userRepository.findOneBy({email:email});
        if(!user) return null;

        const isValid = await bcrypt.compare(password,user.password);
        if(!isValid) return null;

        return user.id;
    }
}
