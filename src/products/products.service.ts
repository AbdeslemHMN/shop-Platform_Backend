import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { OrderStatus } from 'src/utility/common/enums/order-status.entity';
import dataSource from 'db/data-source';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository : Repository<ProductEntity>,
    private readonly categoryService : CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto ,currentUser : UserEntity) : Promise<ProductEntity> {
    const category = await this.categoryService.findOne(+createProductDto.categoryId);
    const product = this.productRepository.create(createProductDto);
    product.addedBy = currentUser;
    product.category = category;
    
    return await this.productRepository.save(product);
    
  }

  async findAll(query: any) : Promise<{products : any[]; totalProducts ; limit }> {
    // let filteredTotalProducts : number
    let limit : number
    if (!query.limit) {
      limit = 4; // Default limit
    }else {
      limit = query.limit; // Convert to number
    }

    const queryBuilder = dataSource.getRepository(ProductEntity)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoin('product.reviews', 'reviews')
      .addSelect([
        'Count(reviews.id) AS totalReviews',
        'AVG(reviews.rating)::numeric(10,2) AS averageRating',
      ])
      .groupBy('product.id , category.id')

    if(query.search) {
      const search = query.search ;
      queryBuilder.andWhere('product.title LIKE :title' , { 
        title: `%${search}%`
      })
    }

    if(query.categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', {
        categoryId: query.categoryId
      });
    }

    if(query.minPrice){
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice: query.minPrice
      }).orderBy('product.price', 'ASC');
    }

    if(query.maxPrice){
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice: query.maxPrice
      }).orderBy('product.price', 'ASC');
    }

    if(query.minRating){
      queryBuilder.andHaving('AVG(reviews.rating) >= :minRating', {
        minRating: query.minRating
      });
    }
    if(query.maxRating) {
      queryBuilder.andHaving('AVG(reviews.rating) <= :maxRating', {
        maxRating: query.maxRating
      });
    }
    queryBuilder.limit(limit);

    if(query.offset) {
      queryBuilder.offset(query.offset);
    } 

    const totalProducts = await queryBuilder.getCount();

    const products = await queryBuilder.getRawMany();


    return {
      products , totalProducts, limit
    }
  }

  async findOne(id: number) : Promise<ProductEntity> {
    const product =await  this.productRepository.findOne({
      where: { id },
      relations: ['addedBy', 'category'],
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
        category: {
          id: true,
          title: true,
          description: true,
        }
      }
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }


  async update(id: number, updateProductDto:Partial <UpdateProductDto> , currentUser : UserEntity):Promise<ProductEntity> {
    const product = await this.findOne(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    Object.assign(product, updateProductDto);
    product.addedBy = currentUser;
    if(updateProductDto.categoryId) {
      const category = await this.categoryService.findOne(+updateProductDto.categoryId);
      product.category = category;
    }
    return await this.productRepository.save(product);
    
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async updateStock(id:number , stock : number, status : OrderStatus ) : Promise<ProductEntity> {
    let product = await this.findOne(id); 
    if(status === OrderStatus.DELIVERED ) {
      product.stock -= stock;
    } else {
      product.stock += stock;
    }
    product = await this.productRepository.save(product);
    return product;
  }
}
