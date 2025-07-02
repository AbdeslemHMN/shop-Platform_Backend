import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSourceOptions } from 'db/data-source'; // Adjust the import path as necessary
import { UsersModule } from './users/users.module';
import { CurrentUserMiddleware } from './utility/middlewares/current-user.middleware';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';




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
    CategoriesModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({path:'*', method: RequestMethod.ALL}); // Apply the middleware to all routes
  }
}
