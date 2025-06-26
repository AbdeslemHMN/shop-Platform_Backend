import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { HashService } from 'src/utility/common/hash/hash.service';
import { UserSignUpDto } from './dto/user-signUp.dto';
import { UserSignInDto } from './dto/user-signIn.dto';
import { sign } from 'jsonwebtoken';

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


  create() {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
