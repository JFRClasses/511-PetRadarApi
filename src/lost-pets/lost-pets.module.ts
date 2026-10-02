import { Module } from '@nestjs/common';
import { LostPetsController } from './lost-pets.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPet } from './entities/lost-pet.entity';
import { LostPetsService } from './lost-pets.service';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([
      LostPet
    ]),
    AuthModule,
    CacheModule
  ],
  controllers: [LostPetsController],
  providers: [LostPetsService]
})
export class LostPetsModule {}
