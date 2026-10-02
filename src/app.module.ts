import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LostPetsModule } from './lost-pets/lost-pets.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/data-source';
import { CacheService } from './cache/cache.service';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    LostPetsModule,
    EmailModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    CacheModule
  ],
  controllers: [AppController],
  providers: [AppService, CacheService],
})
export class AppModule {}
