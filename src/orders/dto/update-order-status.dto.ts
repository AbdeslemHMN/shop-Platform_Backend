import { IsEnum, IsIn, IsNotEmpty } from "class-validator";
import { OrderStatus } from "src/utility/common/enums/order-status.entity";


export class UpdateOrderStatusDto {
    @IsNotEmpty({message: 'Order status is required'})
    @IsEnum(OrderStatus, {message: 'Order status must be a valid enum value'})
    @IsIn([OrderStatus.SHIPPED, OrderStatus.DELIVERED])
    status: OrderStatus;
}



