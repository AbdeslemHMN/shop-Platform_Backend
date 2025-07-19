import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { OrderEntity } from './entities/order.entity';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/common/enums/user-role.enum';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() currentUser: UserEntity) : Promise<OrderEntity> {
    return await this.ordersService.create(createOrderDto, currentUser);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Get()
  async findAll(): Promise<OrderEntity[]> {
    return await this.ordersService.findAll();
  }

  @UseGuards(AuthenticationGuard , AuthorizationGuard([Roles.ADMIN]))
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser:UserEntity) : Promise<OrderEntity> {
    return await this.ordersService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateOrderStatusDto : UpdateOrderStatusDto , @CurrentUser() currentUser: UserEntity) : Promise<OrderEntity> {
    return await this.ordersService.update(+id, updateOrderStatusDto , currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }


  @UseGuards(AuthenticationGuard, AuthorizationGuard([Roles.ADMIN]))
  @Put('cancel/:id')
  async cancelOrder(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: UserEntity): Promise<OrderEntity> {
    return await this.ordersService.cancelOrder(id, currentUser);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me/myOrders')
  async findUserOrders(@CurrentUser() currentUser: UserEntity): Promise<OrderEntity[]> {
    return await this.ordersService.getUserOrders(currentUser);
  }
}
