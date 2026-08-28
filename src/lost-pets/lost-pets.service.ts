import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LostPet } from './entities/lost-pet.entity';
import { CreateLostPetDto } from './dtos/lost-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
// PATRON REPOSITORY
@Injectable()
export class LostPetsService {
    constructor(
        @InjectRepository(LostPet)
        private lostPetRepository : Repository<LostPet>
    ){}

    async getAllPets() : Promise<LostPet[]>{
        const lostPets = await this.lostPetRepository.find();
        return lostPets;
    }

    async createLostPet(dto:CreateLostPetDto) : Promise<LostPet>{
        const newLostPet = this.lostPetRepository.create({
            type: dto.type,
            name: dto.name,
            phone: dto.phone,
            race: dto.race,
            age: dto.age,
            color: dto.color,
            ownerName: dto.ownerName,
            location: {
                type: 'Point',
                coordinates:[dto.lon,dto.lat]
            }
        });
        const lostPet = await this.lostPetRepository.save(newLostPet);
        return lostPet;
    }
}
