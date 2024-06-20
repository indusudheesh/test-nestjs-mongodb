import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import {databaseProviders} from '../database/database.providers'
import { userProviders } from './user.providers';
@Module({
  imports:[DatabaseModule],
  controllers: [UserController],
  providers: [UserService,...databaseProviders,...userProviders],
})
export class UserModule {}
