import { Injectable } from '@nestjs/common';
import { CreateFileUploadDto } from './dto/create-file-upload.dto';
import { UpdateFileUploadDto } from './dto/update-file-upload.dto';
import * as fs from 'fs';
import {
  DELETE_MESSAGE,
  FILE_PREFIX,
  SAVE_FILE_PATH,
  SAVE_FILE_PATH_IMAGE_PROFILE,
} from './file-upload.constants';
import path from 'path';
import { RoleService } from '../role/role.service';

@Injectable()
export class FileUploadService {
  create(createFileUploadDto: CreateFileUploadDto) {
    return 'This action adds a new fileUpload';
  }

  findAll() {
    return `This action returns all fileUpload`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fileUpload`;
  }

  update(id: number, updateFileUploadDto: UpdateFileUploadDto) {
    return `This action updates a #${id} fileUpload`;
  }

  async upload(file: any): Promise<any> {
    const uploadFolder = SAVE_FILE_PATH;

    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
    const filePath = path.join(uploadFolder, file.filename);
    const fileBuffer = Buffer.from(file._buf);
    fs.writeFile(filePath, fileBuffer, (err) => {
      if (err) {
        console.error(err);
      }
    });
    return file.filename;
  }

  async remove(fileName: string): Promise<string> {
    fs.unlink(`${SAVE_FILE_PATH}/${fileName}`, (err) => {
      if (err) {
        return DELETE_MESSAGE.FAIL;
      }
    });
    return DELETE_MESSAGE.SUCCESS;
  }

  async uploadImage(file: any): Promise<any> {
    const uploadFolder = SAVE_FILE_PATH_IMAGE_PROFILE;

    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
    const filePath = path.join(uploadFolder, file.filename);
    const fileBuffer = Buffer.from(file._buf);
    fs.writeFile(filePath, fileBuffer, (err) => {
      if (err) {
        console.error(err);
      }
    });
    return file.filename;
  }

  async removeImage(fileName: string): Promise<string> {
    fs.unlink(`${SAVE_FILE_PATH_IMAGE_PROFILE}/${fileName}`, (err) => {
      if (err) {
        return DELETE_MESSAGE.FAIL;
      }
    });
    return DELETE_MESSAGE.SUCCESS;
  }
}
