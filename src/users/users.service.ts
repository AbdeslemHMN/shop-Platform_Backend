import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { HashService } from 'src/utility/common/hash/hash.service';
import { UserSignUpDto } from './dto/user-signUp.dto';
import { UserSignInDto } from './dto/user-signIn.dto';
import { sign } from 'jsonwebtoken';
import { UserUpdateDto } from './dto/user-update.dto';
import { Roles } from 'src/utility/common/enums/user-role.enum';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly hashService: HashService
  ) {}

  async signup(signupDto : UserSignUpDto) : Promise<Omit<UserEntity,'password'>> {
    const existUser = await this.findUserByEmail(signupDto.email);
    if (existUser) throw new BadRequestException('User with this email already exists');

    const hashedPassword = await this.hashService.hashPassword(signupDto.password);
    const newUser = this.usersRepository.create({
      ...signupDto,
      password: hashedPassword,
    });
    const savedUser = await this.usersRepository.save(newUser);
    const { password, ...sanitizedUser } = savedUser; // Exclude password from the response
    return sanitizedUser;
  }


  async signin(signInDto : UserSignInDto): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.usersRepository
    .createQueryBuilder('users')
    .addSelect('users.password') // Include password for comparison
    .where('users.email = :email', { email: signInDto.email })
    .getOne();

    if (!user) throw new BadRequestException('User with this email does not exist');

    const isPasswordValid = await this.hashService.comparePassword(signInDto.password, user.password);
    if (!isPasswordValid) throw new BadRequestException('Invalid password');

    const { password, ...sanitizedUser } = user; // Exclude password from the response
    return sanitizedUser;
  }

  async findAll() : Promise<UserEntity[]> {
    const users = await this.usersRepository.find();
    if (!users || users.length === 0) throw new NotFoundException('No users found');
    return users;
  }

  async findOne(id: number) : Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user ;
  }

  async update(id: number, updateUserDto: Partial<UserUpdateDto> , currentUser : UserEntity) : Promise<Omit<UserEntity, 'password'>> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    if (!currentUser.role.includes(Roles.ADMIN) && currentUser.id !== user.id) {
      throw new BadRequestException('You are not authorized to update this user');
    }

    if( updateUserDto?.email ) {
      const existingUser = await this.findUserByEmail(updateUserDto.email);
      if (existingUser && existingUser.id !== user.id) {
        throw new BadRequestException('Email already in use by another user');
      }
    }

    if( updateUserDto?.role && !currentUser?.role.includes(Roles.ADMIN)) {
      throw new BadRequestException('You are not authorized to change user roles');
    }

    if (updateUserDto?.password) {
      updateUserDto.password = await this.hashService.hashPassword(updateUserDto.password);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);
    const { password, ...sanitizedUser } = updatedUser; // Exclude password from the response
    return sanitizedUser;
  }

  async remove(id: number) : Promise<{ message: string }> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new BadRequestException('User not found');
    await this.usersRepository.delete(id);
    return { message: 'User deleted successfully' };
  }

  async findUserByEmail(email: string){
    return await this.usersRepository.findOneBy({ email });
  }

  async accessToken(user : Omit<UserEntity , 'password'>):Promise<string> {
    return sign(
      { id : user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET_KEY! ,
      { expiresIn: '30m' }
    )
  }
}
