import { Module } from '@nestjs/common';
import { LostPetsController } from './lost-pets.controller';

@Module({
  controllers: [LostPetsController]
})
export class LostPetsModule {}
