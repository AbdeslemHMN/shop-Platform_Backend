import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT')! ;
  const GLOBAL_PREFIX = configService.get<string>('GLOBAL_PREFIX')! ;

  app.setGlobalPrefix(`${GLOBAL_PREFIX}`); // Set a global prefix for all routes
  await app.listen(PORT).then(() => {
    console.log(`Server is running on http://localhost:${PORT}`);
  }).catch((error) => {
    console.error('Error starting the server:', error);
  }
  );
}
bootstrap();
