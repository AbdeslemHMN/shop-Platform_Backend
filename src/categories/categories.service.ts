import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(CategoryEntity)
    private categoriesRepository: Repository<CategoryEntity> 
  ) {}


  async create(createCategoryDto: CreateCategoryDto , currentUser : UserEntity) : Promise<CategoryEntity> {
    let category = this.categoriesRepository.create(createCategoryDto);
    category.addedBy = currentUser; // Associate the category with the current user
    return await this.categoriesRepository.save(category);
  }

  async findAll() {
    return await this.categoriesRepository.find()
  }

  async findOne(id: number) : Promise<CategoryEntity> {
    const category = await this.categoriesRepository.findOne({
      where : {id: id},
      relations: {addedBy: true}, // Include the user who added the category
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true,
        }
      }
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto:Partial <UpdateCategoryDto>) : Promise<CategoryEntity> {
    const category = await this.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
