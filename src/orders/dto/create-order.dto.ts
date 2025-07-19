import { Type } from "class-transformer";
import { CreateShippingDto } from "./create-shipping.dto";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { OrderedProductDto } from "./order-product.dto";

export class CreateOrderDto {
    @Type(() => CreateShippingDto)
    @ValidateNested()
    @IsNotEmpty({ message: 'Shipping information is required' })
    shippingInfo: CreateShippingDto;

    @Type(() => OrderedProductDto)
    @ValidateNested()
    @IsNotEmpty({ message: 'Ordered products are required' })
    orderedProducts: OrderedProductDto[];

}