import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as responseTime from 'response-time';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT')! ;
  const GLOBAL_PREFIX = configService.get<string>('GLOBAL_PREFIX')! ;

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that do not have any decorators
  }))
  app.setGlobalPrefix(`${GLOBAL_PREFIX}`); // Set a global prefix for all routes

  app.enableCors({
    methods: 'GET,POST,PUT,DELETE', // Allow HTTP methods
    credentials: true, // Allow cookies to be sent
    allowedHeaders: 'Content-Type, Authorization', // Permitted request headers
  }
  ); // Enable CORS for all routes

    app.use(responseTime());


  await app.listen(PORT).then(() => {
    console.log(`Server is running on http://localhost:${PORT}`);
  }).catch((error) => {
    console.error('Error starting the server:', error);
  }
  );
}
bootstrap();
