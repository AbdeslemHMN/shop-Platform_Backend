import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/common/enums/user-role.enum';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthenticationGuard , AuthorizationGuard([Roles.ADMIN]))
  @Post()
  async create(@Body() createProductDto: CreateProductDto , @CurrentUser() currentUser : UserEntity) : Promise<ProductEntity> {
    return this.productsService.create(createProductDto, currentUser);
  }

  
  @Get()
  async findAll(@Query() query:any) : Promise<{products : any[]; totalProducts:number ; limit:number }> {
    return await this.productsService.findAll(query);
  }


  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductEntity> {
    return await this.productsService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard , AuthorizationGuard([Roles.ADMIN]))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @CurrentUser() CurrentUser: UserEntity) : Promise<ProductEntity> {
    return await this.productsService.update(+id, updateProductDto , CurrentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
