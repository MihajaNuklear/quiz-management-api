import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as env from 'env-var';

dotenv.config({ path: '.env' });

@Injectable()
export class ApiKeyGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        
        const request = context.switchToHttp().getRequest();
        const bearerApikey = request.headers.authorization;
        if (!bearerApikey || !bearerApikey.startsWith('Bearer ')) {
            return false;
        }
        const apikey = bearerApikey.substring(7);

        if (apikey == env.get('API_KEY').asString()) {
            return true
        } else {
            return false;
        }
    }
}