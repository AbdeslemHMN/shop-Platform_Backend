import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto {

    @IsString({message: 'Title must be a string'})
    @IsNotEmpty({message: 'Title is required'})
    title: string;

    @IsString({message: 'Description must be a string'})
    @IsNotEmpty({message: 'Description is required'})
    description: string;

    @IsNotEmpty({message: 'Price is required'})
    @IsNumber(
        {maxDecimalPlaces: 2},
        {message: 'Price must be a number'})
    @IsPositive({message: 'Price must be a positive number'})
    price: number;

    @IsNotEmpty({message: 'Stock is required'})
    @IsNumber({}, {message: 'Stock must be a number'})
    @Min(0, {message: 'Stock must be a positive number'})
    stock: number;

    @IsNotEmpty({message: 'Images are required'})
    @IsArray({message: 'Images must be an array'})
    images: string[];

    @IsNotEmpty({message: 'Category is required'})
    @IsNumber({}, {message: 'CategoryId must be a number'})
    categoryId: number;

}
