import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import morgan from 'morgan';

import fastifyMultipart from '@fastify/multipart';
import { AppModule } from './app.module';
import { CONFIGURATION_TOKEN_DI } from './config/configuration-di.constant';
import { ConfigurationType } from './config/configuration.interface';
import { configureSwagger } from './config/swagger-configuration.constant';
import { getValidationPipe } from './config/validation-pipe-configuration.constant';
import { ErrorsInterceptor } from './core/interceptors/errors.interceptor';
import { morganStream } from './core/logger/logger.configuration';
import { getProxyRoutes } from './core/proxy/proxy-configuration.constant';
import { setupProxy } from './core/proxy/proxy.setup.constant';
import path from 'path';
import fastifyStatic = require('@fastify/static');

/**
 * Bootstrap nest application
 */
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ trustProxy: true, logger: true }),
    {
      //logger: WinstonModule.createLogger(USED_WINSTON_MODULE_OPTIONS),
    },
  );

  app.enableCors();
  app.use(morgan('combined', { stream: morganStream }));
  const configuration = app.get<ConfigurationType>(CONFIGURATION_TOKEN_DI);
  setupProxy(app, configuration, getProxyRoutes(configuration));
  configureSwagger(app, configuration);
  app.register(fastifyMultipart, {
    attachFieldsToBody: true,
    limits: { fileSize: 5242880 },
  });
  app.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'public'),
  });
  app.useGlobalInterceptors(new ErrorsInterceptor());
  app.useGlobalPipes(getValidationPipe());
  await app.listen(configuration.server.port, configuration.server.host);
}

bootstrap();
