import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { envs } from 'src/config/envs';
// Orquestador de Contendores
@Injectable()
export class CacheService {

    private readonly redis = new Redis({
        host: envs.REDIS_HOST,
        port: envs.REDIS_PORT
    });

    async set(key:string,value:any){
       const valueInString = JSON.stringify(value);
       await this.redis.set(key,valueInString);
    }
// GENERICOS T K L get<User>() List<FoundPet>
    async get<T>(key: string): Promise<T | null>{
       const value = await this.redis.get(key);
       if(!value) return null;
       const object = JSON.parse(value) as T;
       return object;
    }

    async delete(key:string){
        await this.redis.del(key);
    }
}
