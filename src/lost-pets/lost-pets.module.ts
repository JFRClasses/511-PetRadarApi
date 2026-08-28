import { Module } from '@nestjs/common';
import { LostPetsController } from './lost-pets.controller';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPet } from './entities/lost-pet.entity';
import { LostPetsService } from './lost-pets.service';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([
      LostPet
    ])
  ],
  controllers: [LostPetsController],
  providers: [LostPetsService]
})
export class LostPetsModule {}
