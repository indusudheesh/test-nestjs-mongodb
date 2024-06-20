import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('/addBlog')
  @UseInterceptors(FileInterceptor('file', { dest: './public' }))
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
    @Req() req,
  ) {
    createBlogDto.authorId = req.headers.authorId;
    createBlogDto.imageUrl = file.filename;
    let result = await this.blogService.createBlog(createBlogDto);
    response.status(result.status).send(result.data);
  }

  @Get('/getAllBlogs')
  async getAllBlogs(@Res() response: Response,) {
    let result = await this.blogService.getAllBlogs();
    response.status(result.status).send(result.data);
  }

  @Get('/getSingleBlog/:blogId')
  async getSingleBlog(@Param('blogId') blogId: string,@Res() response: Response,) {
    let result = await this.blogService.getSingleBlog(blogId);
    response.status(result.status).send(result.data);
  }

  @Patch('/updateBlog/:blogId')
  @UseInterceptors(FileInterceptor('file', { dest: './public' }))
  async updateBlog(
    @Param('blogId') blogId: string,
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
    @Req() req,
  ) {
    createBlogDto.authorId = req.headers.authorId;
    if (file) createBlogDto.imageUrl = file.filename;
    let result = await this.blogService.updateBlog(blogId, createBlogDto);
    response.status(result.status).send(result.data);
  }

  @Delete('/deleteBlog/:blogId')
  async deleteBlog(@Param('blogId') blogId: string, @Res() response: Response) {
    let result = await this.blogService.deleteBlog(blogId);
    response.status(result.status).send(result.data);
  }
}
