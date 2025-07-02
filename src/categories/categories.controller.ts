import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/common/enums/user-role.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { CategoryEntity } from './entities/category.entity';
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}


  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto ,
    @CurrentUser() currentUser: UserEntity, 
  
  ) : Promise<CategoryEntity> {
    return await this.categoriesService.create(createCategoryDto , currentUser);
  }


  @Get()
  async findAll() : Promise<CategoryEntity[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<CategoryEntity> {
    return await this.categoriesService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: Partial<UpdateCategoryDto>) : Promise<CategoryEntity> {
    return await this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
