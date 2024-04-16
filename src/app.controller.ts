import {
    Controller,
    HttpStatus,
    Get,
    Res,
  } from '@nestjs/common';
  import { FastifyReply } from 'fastify';
import { HttpResponseService } from './core/services/http-response/http-response.service';

@Controller('status')
export class AppController {

    @Get()
    getApiStatus(@Res() res: FastifyReply) {
        HttpResponseService.sendSuccess<any>(res, HttpStatus.OK, {message: "api is ok"});
    }
  
}