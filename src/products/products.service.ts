import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository : Repository<ProductEntity>,
    private readonly categoryService : CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto ,currentUser : UserEntity) : Promise<ProductEntity> {
    const category = await this.categoryService.findOne(+createProductDto.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    const product = this.productRepository.create(createProductDto);
    product.addedBy = currentUser;
    product.category = category;
    
    return await this.productRepository.save(product);
    
  }

  async findAll() : Promise<ProductEntity[]> {
    return await this.productRepository.find({
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
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
