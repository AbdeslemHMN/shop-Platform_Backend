import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-signUp.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signIn.dto';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
    
    @Post('signup')
    async signin(@Body() signUpDto: UserSignUpDto): Promise<{user: Omit<UserEntity, 'password'>}> {
        return {user : await this.usersService.signin(signUpDto)};
    }

    @Post('signin')
    async signup(@Body() signInDto: UserSignInDto): Promise<
    {user:Omit<UserEntity, 'password'> ,
        accessToken: string}>
        {
        const user = await this.usersService.signin(signInDto);
        const accessToken = await this.usersService.accessToken(user);
        return { user, accessToken };
    }

    
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}