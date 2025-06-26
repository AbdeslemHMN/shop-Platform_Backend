import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSourceOptions } from 'db/data-source'; // Adjust the import path as necessary
import { UsersModule } from './users/users.module';




@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
      envFilePath: '.env', //shop Path to .env file
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000), // Default port if not specified
        GLOBAL_PREFIX: Joi.string().default('api/v1'), // Default global prefix
      }),
    }),
    TypeOrmModule.forRoot(AppDataSourceOptions),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
