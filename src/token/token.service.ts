import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import config from '../config/configuration.constant';
@Injectable()
export class TokenService {
  generateToken(payload: any): string {
    const secretKey = config().jwt.secretKey;

    const token = jwt.sign(payload, secretKey, {
      expiresIn: config().jwt.expiration,
    });

    return token;
  }
}
