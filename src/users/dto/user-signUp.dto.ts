import { IsNotEmpty, IsString } from "class-validator";
import { UserSignInDto } from "./user-signIn.dto";


export class UserSignUpDto extends UserSignInDto {
    @IsNotEmpty({message: 'Name is required'})
    @IsString({message: 'Name must be a string'})
    name: string;
    
}