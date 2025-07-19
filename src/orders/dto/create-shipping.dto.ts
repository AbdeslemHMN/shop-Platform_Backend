import { IsNotEmpty, IsString } from "class-validator";


export class CreateShippingDto {
    @IsNotEmpty({ message: 'Phone number is required' })
    @IsString({ message: 'Phone number must be a string' })
    phone: string;

    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsNotEmpty({ message: 'Address is required' })
    @IsString({ message: 'Address must be a string' })
    address: string;

    @IsNotEmpty({ message: 'City is required' })
    @IsString({ message: 'City must be a string' })
    city: string;

    @IsNotEmpty({ message: 'Postal code is required' })
    @IsString({ message: 'Postal code must be a string' })
    postalCode: string;

    @IsNotEmpty({ message: 'Country is required' })
    @IsString({ message: 'Country must be a string' })
    country: string;

    @IsNotEmpty({ message: 'State is required' })
    @IsString({ message: 'State must be a string' })
    state: string;
}