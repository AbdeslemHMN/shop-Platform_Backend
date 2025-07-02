import { Controller, Get, Post, Body,Param, Delete, ParseIntPipe, Put, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-signUp.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signIn.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-role.decorator';
import { Roles } from 'src/utility/common/enums/user-role.enum';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { UserUpdateDto } from './dto/user-update.dto';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
    // @desc Sign up a new user
    @Post('signup')
    async signup(@Body() signUpDto: UserSignUpDto): Promise<{user: Omit<UserEntity, 'password'>}> {
        return {user : await this.usersService.signup(signUpDto)};
    }

    // @desc Sign in an existing user
    @Post('signin')
    async signin(@Body() signInDto: UserSignInDto): Promise<
    {user:Omit<UserEntity, 'password'> ,
        accessToken: string}>
        {
        const user = await this.usersService.signin(signInDto);
        const accessToken = await this.usersService.accessToken(user);
        return { user, accessToken };
    }

    // @desc Get all users
    // @AuthorizeRoles(Roles.ADMIN)
    @UseGuards(AuthenticationGuard , AuthorizationGuard([Roles.ADMIN]))
    @Get('all')
    async findAll() : Promise<UserEntity[]> {
        return await this.usersService.findAll();
    }

    // @desc Get a user by ID
    @Get('single/:id')
    async findOne(@Param('id',ParseIntPipe) id: number) : Promise<UserEntity> {
        return await this.usersService.findOne(+id);
    }

    //@desc delete a user by ID
    @UseGuards(AuthenticationGuard)
    @Delete('single/:id')
    async remove(@Param('id',ParseIntPipe) id: string) {
        return await this.usersService.remove(+id);
    }

    @UseGuards(AuthenticationGuard)
    @Get('me')
    getProfile(@CurrentUser() currentUser: UserEntity): UserEntity {
        if (!currentUser) {
            throw new Error('No user is authenticated');
        }
        return currentUser;
    }

    @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
    @Patch('update/:id')
    async update(@Param('id', ParseIntPipe) id: string, @Body() updateUserDto: Partial<UserUpdateDto>, @CurrentUser() currentUser: UserEntity): Promise<Omit<UserEntity, 'password'>> {
        return await this.usersService.update(+id, updateUserDto, currentUser);
    }
}