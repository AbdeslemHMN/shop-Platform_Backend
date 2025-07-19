import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { HashModule } from 'src/utility/common/hash/hash.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]) , HashModule], 
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]
  
})
export class UsersModule {}

