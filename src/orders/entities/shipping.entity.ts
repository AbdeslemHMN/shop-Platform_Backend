import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";


@Entity({name: 'shippings'})
export class ShippingEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phone: string;

    @Column()
    name: string;

    @Column()   
    address: string;

    @Column()
    city: string;

    @Column()
    postalCode: string;

    @Column()
    country: string;

    @Column()
    state: string;

    @OneToOne(() => OrderEntity, (order) => order.shippingInfo)
    order: OrderEntity;
}