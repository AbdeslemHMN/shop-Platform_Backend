import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class OrderedProductDto {
    @IsNotEmpty({ message: 'Product unit price is required' })
    @IsNumber({maxDecimalPlaces : 2}, { message: 'Product unit price must be a number' })
    @IsPositive({ message: 'Product unit price must be a positive number' })
    product_unit_price: number;

    @IsNotEmpty({ message: 'Product quantity is required' })
    @IsNumber({}, { message: 'Product quantity must be a number' })
    @IsPositive({ message: 'Product quantity must be a positive number' })
    product_quantity: number;

    @IsNotEmpty({ message: 'Product ID is required' })
    @IsNumber({}, { message: 'Product ID must be a number' })
    productId: number;

}