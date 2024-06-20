import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}  

  async signup(createUserDto: CreateUserDto) {
    let userExist = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (!userExist) {
      let salt = await bcrypt.genSalt(Number(10));
      let hash = await bcrypt.hash(createUserDto.password, salt);
      createUserDto.password = hash;
      let user = await new this.userModel(createUserDto).save();
      return {
        data: {
          status: true,
          data: user,
        },
        status: HttpStatus.CREATED,
      };
    } else {
      return {
        data: {
          status: true,
          data: {},
          message: 'user already registered with this email',
        },
        status: HttpStatus.CONFLICT,
      };
    }
  }

  async login(createUserDto: CreateUserDto) {
    let userExist: User | null = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (userExist) {
      let isMatch = await bcrypt.compare(
        createUserDto.password,
        userExist.password,
      );
      if (isMatch)
       {
        let account = { _id: userExist._id, name:userExist.name};
        let token = jwt.sign(
         account,
          "secretforjsonwebtoken",
          { algorithm: "HS256", expiresIn: 172800 }
        );
        return {
          data: {
            status: true,
            message: 'you are logged in',
            token,
          },
          status: HttpStatus.OK,
        };
      }
      else
        return {
          data: {
            status: true,
            message: 'password mismatch',
          },
          status: HttpStatus.FORBIDDEN,
        };
    } else {
      return {
        data: {
          status: true,
          message: 'no such user registered with this email',
        },
        status: HttpStatus.NOT_FOUND,
      };
    }
  }
}
