import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserSignInDto } from "./user-signIn.dto";
import { Roles } from "src/utility/common/enums/user-role.enum";


export class UserSignUpDto extends UserSignInDto {
    @IsNotEmpty({message: 'Name is required'})
    @IsString({message: 'Name must be a string'})
    name: string;

    @IsOptional()
    @IsArray()
    @IsEnum(Roles, { each: true, message: 'Role must be user or admin' })
    role?: Roles[]; 
    
}