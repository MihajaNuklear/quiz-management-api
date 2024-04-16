import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Next,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { CreateFileUploadDto } from './dto/create-file-upload.dto';
import { UpdateFileUploadDto } from './dto/update-file-upload.dto';
import { FILE_PREFIX, SAVE_FILE_PATH } from './file-upload.constants';
import { NextFunction } from 'express';
import { FastifyReply } from 'fastify';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpResponseService } from '../core/services/http-response/http-response.service';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  create(@Body() createFileUploadDto: CreateFileUploadDto) {
    return this.fileUploadService.create(createFileUploadDto);
  }

  @Get()
  findAll() {
    return this.fileUploadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileUploadService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFileUploadDto: UpdateFileUploadDto,
  ) {
    return this.fileUploadService.update(+id, updateFileUploadDto);
  }

  @Post('diploma')
  async uploadFile(
    @Body() body: any,
    @Res() res: any,
    @Next() next: FastifyReply,
  ) {
    const { files } = body;
    const result = await this.fileUploadService.upload(files);
    HttpResponseService.sendSuccess<any>(res, HttpStatus.CREATED, result);
  }

  @Delete('diploma/:filename')
  async remove(
    @Param('filename') fileName: string,
    @Res() res: any,
    @Next() next: NextFunction,
  ) {
    const result = await this.fileUploadService.remove(fileName);
    HttpResponseService.sendSuccess<string>(res, HttpStatus.OK, result);
  }

  @Post('image')
  async uploadImage(
    @Body() body: any,
    @Res() res: any,
    @Next() next: FastifyReply,
  ) {
    const { files } = body;

    const result = await this.fileUploadService.uploadImage(files);
    HttpResponseService.sendSuccess<any>(res, HttpStatus.CREATED, result);
  }

  @Delete('image/:filename')
  async removeImage(
    @Param('filename') fileName: string,
    @Res() res: any,
    @Next() next: NextFunction,
  ) {
    const result = await this.fileUploadService.removeImage(fileName);
    HttpResponseService.sendSuccess<string>(res, HttpStatus.OK, result);
  }
}
