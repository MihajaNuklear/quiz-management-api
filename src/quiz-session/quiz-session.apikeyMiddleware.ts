import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { FastifyReply } from 'fastify';
import { HttpErrorUnauthorizedFactory } from 'src/core/http-error/factories/4XX/401/http-error-bad-request.factory';

import * as dotenv from 'dotenv';
import * as env from 'env-var';
dotenv.config({ path: '.env' });

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: FastifyReply, next: NextFunction) {
    const bearerApiKey = req.headers.authorization;
    console.log('============================');
    console.log(bearerApiKey);
    console.log('============================');
    if (!bearerApiKey || !bearerApiKey.startsWith('Bearer ')) {
      HttpErrorUnauthorizedFactory.create(res, 'Unauthorized Ressources');
    }
    const apiKey = bearerApiKey.substring(7);

    console.log(bearerApiKey);
    if (!apiKey || apiKey !== env.get('API_KEY_QUIZ').asString()) {
      HttpErrorUnauthorizedFactory.create(res, 'Unauthorized Ressources');
    }
    next();
  }
}
