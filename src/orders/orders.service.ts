import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { ShippingEntity } from './entities/shipping.entity';
import { OrdersProductEntity } from './entities/orders-product.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from 'src/utility/common/enums/order-status.entity';


@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrdersProductEntity)
    private readonly ordersProductRepository: Repository<OrdersProductEntity>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productService: ProductsService,
  ) 
  {}


  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity) : Promise<OrderEntity> {
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingInfo);

    const orderEntity = new OrderEntity();
    orderEntity.user = currentUser;
    orderEntity.shippingInfo = shippingEntity;

    const savedOrder = await this.orderRepository.save(orderEntity);
    
    let opEntity : {
      order: OrderEntity , 
      product: ProductEntity ,
      product_unit_price: number ,
      product_quantity: number
    }[]=[];

    // Loop through ordered products and create OrdersProductEntity instances  
    for (let i = 0 ; i < createOrderDto.orderedProducts.length; i++) {
      const order = savedOrder;
      const product = await this.productService.findOne(createOrderDto.orderedProducts[i].productId);
      const product_unit_price = createOrderDto.orderedProducts[i].product_unit_price;
      const product_quantity = createOrderDto.orderedProducts[i].product_quantity;
      
      opEntity.push({
        order: order,
        product: product,
        product_unit_price: product_unit_price,
        product_quantity: product_quantity
      });
    }

    const op = this.ordersProductRepository
    .createQueryBuilder()
    .insert()
    .into(OrdersProductEntity)
    .values(opEntity)
    .execute();

    return await this.findOne(savedOrder.id);
  }

  async findAll() : Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      relations: {
        user : true , 
        shippingInfo: true,
        ordersProducts: {
          product: true
        },
      } , 
      select: {
        id: true,
        user: {
          id: true,
          name: true,
          email: true,
        },
        shippingInfo: {
          id: true,
          address: true,
          city: true,
          postalCode: true,
          country: true,
        },
        ordersProducts: {
          id: true,
          product_unit_price: true,
          product_quantity: true,
          product: {
            id: true,
            title: true,
            price: true,
            images: true
          }
        }
      }
    });
  }

  async findOne(id: number) : Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id: id },
      relations: {
        user : true , 
        shippingInfo: true,
        ordersProducts: {
          product: true
        },
      } , 
      select: {
        id: true,
        status: true,
        user: {
          id: true,
          name: true,
          email: true,
        },
        shippingInfo: {
          id: true,
          address: true,
          city: true,
          postalCode: true,
          country: true,
        },
        ordersProducts: {
          id: true,
          product_unit_price: true,
          product_quantity: true,
          product: {
            id: true,
            title: true,
            price: true,
            images: true
          }
        }
      }
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderStatusDto : UpdateOrderStatusDto , currentUser: UserEntity) : Promise<OrderEntity> { 
    let order = await this.findOne(id);

    if( order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new ForbiddenException(`Order with ID ${id} cannot be updated as it is already ${order.status}`);
    }

    if(order.status === OrderStatus.PROCESSING && updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      throw new ForbiddenException(`Order with ID ${id} cannot be marked as DELIVERED while it is still PROCESSING , please update it to SHIPPED first`);
    }
    if(updateOrderStatusDto.status === OrderStatus.SHIPPED && order.status === OrderStatus.SHIPPED) {
      return order; // No change needed, return the existing order
    }

    if(updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    }
    if(updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    order.status = updateOrderStatusDto.status;
    order.ordersUpdatedBy = currentUser;

    order = await this.orderRepository.save(order);   

    if(updateOrderStatusDto.status === OrderStatus.DELIVERED ) {
      await this.updateStock(order, OrderStatus.DELIVERED);
    }

    return order;
    
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async cancelOrder(id: number, currentUser: UserEntity): Promise<OrderEntity> {
    let order = await this.findOne(id);
    
    if (order.status === OrderStatus.CANCELLED) {
      return order; // No change needed, return the existing order
    }
    order.status = OrderStatus.CANCELLED;
    order.ordersUpdatedBy = currentUser;
    order = await this.orderRepository.save(order);
    await this.updateStock(order, OrderStatus.CANCELLED);
    return order;
  }

async getUserOrders(currentUser: UserEntity): Promise<OrderEntity[]> {
  return await this.orderRepository.find({
    where: {
      user: {
        id: +currentUser.id,
      },
    },
    relations: {
      user: true,
      shippingInfo: true,
      ordersProducts: {
        product: true,
      },
    },
  });
}

async updateStock(order : OrderEntity , status : OrderStatus)  {
    for (const orderProduct of order.ordersProducts) {
      await this.productService.updateStock(orderProduct.product.id, orderProduct.product_quantity, status);
    }
  }

async findByProductId(productId: number) {
  return await this.ordersProductRepository.find({
    relations : { product: true },
    where: {
      product: {
        id: productId,
      },
    },
  });
}
}
