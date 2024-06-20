import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { DatabaseModule } from '../database/database.module';
import {databaseProviders} from '../database/database.providers'
import { blogProviders } from './blog.providers';
import {userProviders} from '../user/user.providers'

@Module({
  imports:[DatabaseModule],
  controllers: [BlogController],
  providers: [BlogService,...databaseProviders,...blogProviders,...userProviders],
})
export class BlogModule {}
