import { PartialType } from "@nestjs/mapped-types";
import { UserSignUpDto } from "./user-signUp.dto";


export class UserUpdateDto extends PartialType(UserSignUpDto) {}