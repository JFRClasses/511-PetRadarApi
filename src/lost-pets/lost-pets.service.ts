import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LostPet } from './entities/lost-pet.entity';
import { CreateLostPetDto } from './dtos/lost-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from 'src/cache/cache.service';
// PATRON REPOSITORY
// SQL / Redis Clave-Valor / ElasticSearch NoSQL

export const LOST_PET_ALL_CACHE_KEY = "lost-pets:all";
@Injectable()
export class LostPetsService {
    constructor(
        @InjectRepository(LostPet)
        private lostPetRepository : Repository<LostPet>,
        private cacheService: CacheService
    ){}
//<>
// MAGIC STRING "NORtH" "SOUTH"
// Typos
    async getAllPets() : Promise<LostPet[]>{
        const cached = await this.cacheService.get<LostPet[]>(LOST_PET_ALL_CACHE_KEY);
        if(cached) return cached;

        const lostPets = await this.lostPetRepository.find();
        await this.cacheService.set(LOST_PET_ALL_CACHE_KEY,lostPets);

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
        await this.cacheService.delete(LOST_PET_ALL_CACHE_KEY);
        return lostPet;
    }
}
