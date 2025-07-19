import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewEntity } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { Roles } from 'src/utility/common/enums/user-role.enum';

@Injectable()


export class ReviewsService {

  constructor(
  @InjectRepository(ReviewEntity)
  private readonly reviewRepository:Repository<ReviewEntity> ,
  private readonly productsService : ProductsService )
  {}


  async create(createReviewDto: CreateReviewDto , currentUser : UserEntity) : Promise<ReviewEntity> {
    const product = await this.productsService.findOne(+createReviewDto.productId);
    let review = await this.findByUserIdAndProductId(currentUser.id, product.id);
    if(!review){
      review = this.reviewRepository.create(createReviewDto);
      review.user = currentUser;
      review.product = product;
    } else {
      (review.rating = createReviewDto.rating);
      (review.comment = createReviewDto.comment);
    }
    return await this.reviewRepository.save(review);
  }

  findAll() {
    return `This action returns all reviews`;
  }

  async findAllByProduct(id: number) : Promise<ReviewEntity[]> {
    const product = await this.productsService.findOne(id);
    const reviews = await this.reviewRepository.find({
      where: { product: { id: product.id } },
      relations : {
        user: true,
        product: {
          category: true,
        }
      },
      select: {
        user: {
          id: true,
          name: true,
          email: true,
        },
        product: {
          id: true,
          title: true,
          description: true,
          price: true,
          category: {
            id: true,
            title: true,  
            description: true,
          }
        }
      }
    });
    if (!reviews || reviews.length === 0) {
      throw new NotFoundException(`No reviews found for product with id ${id}`);
    }
    return reviews;
  }

  async findOne(id: number) : Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: {
        user: true,
        product: {
          category: true,
        }
      }
    });
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return review;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  async remove(id: number , currentUser: UserEntity) : Promise<string> {
    const review = await this.findOne(id);
    
    if (review.user.id !== currentUser.id && !currentUser.role.includes(Roles.ADMIN)) {
      throw new NotFoundException(`You are not authorized to delete this review`);
    }
    await this.reviewRepository.delete(id);
    return `Review with id ${id} has been deleted successfully`;
  }

  async findByUserIdAndProductId( userId: number, productId: number){
    return await this.reviewRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId }
      }
    });
  }
}
