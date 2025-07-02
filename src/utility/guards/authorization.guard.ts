
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, mixin } from '@nestjs/common';
import { Reflector } from '@nestjs/core';


// @Injectable()
// export class AuthorizationGuard implements CanActivate {
//     constructor(private reflector:Reflector) {}

//     canActivate(
//     context: ExecutionContext,
// ): boolean  {
//     const allowedRoles = this.reflector.get<string[]>('allowedRoles', context.getHandler());
//     const request = context.switchToHttp().getRequest();
//     const currentUser = request?.currentUser;
    
//     if (!currentUser || !Array.isArray(currentUser.role)) {
//         throw new UnauthorizedException('Not authenticated or invalid role format');
//     }
//     const hasAccess = currentUser.role.some((role: string) => allowedRoles.includes(role));
//     if (hasAccess) return true;
    
//     throw new UnauthorizedException('You are not authorized to access this resource');
// }
// }

export const AuthorizationGuard = (allowedRoles: string[])  => {
    class RolesGuardMixin implements CanActivate {
        canActivate(context: ExecutionContext): boolean {
            const request = context.switchToHttp().getRequest();
            const currentUser = request?.currentUser;
            
            if (!currentUser || !Array.isArray(currentUser.role)) {
                throw new UnauthorizedException('Not authenticated or invalid role format');
            }
            const hasAccess = currentUser.role.some((role: string) => allowedRoles.includes(role));
            if (hasAccess) return true;
    
            throw new UnauthorizedException('You are not authorized to access this resource');
            
        } 
    } 
    const guard = mixin(RolesGuardMixin);
    return guard;
}