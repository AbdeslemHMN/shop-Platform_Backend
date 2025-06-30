import { IsArray, IsEmail, IsEnum, IsOptional, MinLength } from "class-validator";
import { Roles } from "src/utility/common/enums/user-role.enum";


export class UserUpdateDto {
    @IsOptional()
    name?: string;
    @IsOptional()
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email?: string;
    @IsOptional()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password?: string;
    @IsOptional()
    @IsArray()
    @IsEnum(Roles, { each: true, message: 'Role must be user or admin' })
    role?: Roles[];
}