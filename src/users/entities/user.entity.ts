import { CategoryEntity } from "src/categories/entities/category.entity";
import { ProductEntity } from "src/products/entities/product.entity";
import { Roles } from "src/utility/common/enums/user-role.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";


@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 20 , nullable: false})
    name: string;

    @Column({unique: true})
    email: string;

    @Column({select: false})
    password: string;

    @Column({ type: 'enum', enum: Roles , array: true, default: [Roles.USER] })
    role: Roles[];

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @OneToMany(() => CategoryEntity, (cat) => cat.addedBy)
    categories: CategoryEntity[];

    @OneToMany(() => ProductEntity, (product) => product.addedBy)
    products: ProductEntity[];

}
