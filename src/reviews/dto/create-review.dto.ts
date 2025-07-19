import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
    
    @IsNotEmpty({message: 'Rating is required'})
    @IsNumber({},{message: 'Rating must be a number'})
    @Min(0, {message: 'Rating must be at least 0'})
    @Max(5, {message: 'Rating must be at most 5'})
    rating: number;

    @IsNotEmpty({message: 'Comment is required'})
    @IsString({message: 'Comment must be a string'})
    comment: string;

    @IsNotEmpty({message: 'User ID is required'})
    @IsNumber({},{message: 'User ID must be a number'})
    productId: number;


}
