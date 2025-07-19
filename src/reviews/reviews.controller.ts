import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ReviewEntity } from './entities/review.entity';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/common/enums/user-role.enum';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthenticationGuard , AuthorizationGuard([Roles.ADMIN]))
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto , @CurrentUser() currentUser : UserEntity): Promise<ReviewEntity> {
    return await this.reviewsService.create(createReviewDto , currentUser);
  }

  @Get('all')
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('product/:id')
  async findAllByProduct(@Param('id') id: string) : Promise<ReviewEntity[]> {
    return await this.reviewsService.findAllByProduct(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  async remove(@Param('id') id: string , @CurrentUser() currentUser: UserEntity): Promise<string> {
    return await this.reviewsService.remove(+id , currentUser);
  }
}
