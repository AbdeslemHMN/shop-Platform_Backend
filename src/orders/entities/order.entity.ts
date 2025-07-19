import { UserEntity } from "src/users/entities/user.entity";
import { OrderStatus } from "src/utility/common/enums/order-status.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ShippingEntity } from "./shipping.entity";
import { OrdersProductEntity } from "./orders-product.entity";


@Entity({ name: 'orders' })
export class OrderEntity {

    @PrimaryGeneratedColumn()
    id: number;                                                                                                                                                                                                                                                                                                     

    @CreateDateColumn()
    orderAt: Timestamp;

    @Column({ type : 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
    status: OrderStatus;

    @Column({nullable: true})
    shippedAt: Date 

    @Column({nullable: true})
    deliveredAt: Date;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @ManyToOne(()=> UserEntity, (user) => user.orders)
    user: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.ordersUpdatedBy)
    ordersUpdatedBy: UserEntity;

    @OneToOne(() => ShippingEntity, (shipping) => shipping.order , {cascade: true})
    @JoinColumn()
    shippingInfo: ShippingEntity;
    
    @OneToMany(() => OrdersProductEntity, (ordersProduct) => ordersProduct.order , {cascade: true})
    ordersProducts: OrdersProductEntity[];
}
