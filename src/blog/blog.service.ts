import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import mongoose, { Model } from 'mongoose';
import { User } from '../user/interfaces/user.interface';
import { Blog } from './interfaces/blog.interface';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class BlogService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    @Inject('BLOG_MODEL')
    private blogModel: Model<Blog>,
  ) {}

  async createBlog(createBlogDto: CreateBlogDto) {
    let blog = await new this.blogModel(createBlogDto).save();
    if (blog)
      return {
        data: {
          status: true,
          data: blog,
        },
        status: HttpStatus.CREATED,
      };
    else
      return {
        data: {
          status: false,
          data: {},
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      };
  }

  async getAllBlogs() {
    let blog = await this.blogModel
      .aggregate([
        {
          $match: {},
        },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $project: {
            _id: 0,
            blogId: '$_id',
            title: 1,
            description: 1,
            postedTime: {
              $dateToString: {
                date: '$createdAt',
                format: '%d-%m-%Y %H:%M',
              },
            },
            imageUrl: { $concat: ['localhost:3000/', '$imageUrl'] },
            userName: { $first: '$user.name' },
          },
        },
      ])
      .sort({ createdAt: -1 });

    return {
      data: {
        status: true,
        data: blog,
      },
      status: HttpStatus.OK,
    };
  }

  async getSingleBlog(blogId: string) {
    let blog = await this.blogModel
      .aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(blogId) },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $project: {
            _id: 0,
            blogId: '$_id',
            title: 1,
            description: 1,
            postedTime: {
              $dateToString: {
                date: '$createdAt',
                format: '%d-%m-%Y %H:%M',
              },
            },
            imageUrl: 1,
            userName: { $first: '$user.name' },
          },
        },
      ])
      .sort({ createdAt: -1 });
    blog.length ? (blog = blog[0]) : {};
    return {
      data: {
        status: true,
        data: blog,
      },
      status: HttpStatus.OK,
    };
  }

  async updateBlog(blogId: string, updateBlogDto: CreateBlogDto) {
    let blog = await this.blogModel.findByIdAndUpdate(
      { _id: blogId },
      { $set: updateBlogDto },
      { new: true },
    );
    if (blog)
      return {
        data: {
          status: true,
          data: blog,
          message: 'blog updated',
        },
        status: HttpStatus.OK,
      };
    else
      return {
        data: {
          status: false,
          data: {},
          message: 'unprocessed',
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      };
  }

  async deleteBlog(blogId: string) {
    let blog: Blog | null = await this.blogModel.findOne({ _id: blogId });
    if (blog) {
      let path = join(__dirname, '../..', 'public');
      fs.unlink(`${path}/${blog.imageUrl}`, (err) => {
        if (err) {
          console.error(err);
          return err;
        }
      });
      blog = await this.blogModel.findOneAndDelete({ _id: blogId });
      return {
        data: {
          status: true,
          message: 'blog has been deleted',
        },
        status: HttpStatus.OK,
      };
    } else
      return {
        data: {
          status: false,
          message: 'unprocessed.check payload',
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      };
  }
}
