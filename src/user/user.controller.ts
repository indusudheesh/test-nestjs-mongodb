import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signUp')
  async signup(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
    var result =await this.userService.signup(createUserDto);
    response.status(result.status).send(result.data);
  }

  @Post('/login')
  async login(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
    var result =await this.userService.login(createUserDto);
    response.status(result.status).send(result.data);
  }
 

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    
  }

  
}
