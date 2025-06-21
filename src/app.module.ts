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
        // DB_HOST: Joi.string().required(), // Database host must be provided
        // DB_PORT: Joi.string().required(), // Database port must be provided
        // DB_USERNAME: Joi.string().required(), // Database username must be provided
        // DB_PASSWORD: Joi.string().required(), // Database password must be provided
        // DB_DATABASE: Joi.string().required(), // Database name must be provided
        // ACCESS_TOKEN_SECRET_KEY: Joi.string().required(), // Access token secret key must be provided
        // ACCESS_TOKEN_EXPIRE_TIME: Joi.string().default('1h'), // Default access token expiration time
      }),
    }),
    TypeOrmModule.forRoot(AppDataSourceOptions),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
