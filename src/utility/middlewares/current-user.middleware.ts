
import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserEntity; 
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor( private readonly UsersService:UsersService){}
    async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader || isArray(authHeader) ||!authHeader.startsWith('Bearer ')) {
        req.currentUser = undefined; // No user is authenticated
        next() ;
    } else {
        try {
            const token = authHeader.split(' ')[1]; // Extract the token from the header

            const accessToken = process.env.ACCESS_TOKEN_SECRET_KEY;

            const decodedToken = verify(token, accessToken!) as JwtPayload;
            const {id} = decodedToken;
            const currentUser = await this.UsersService.findOne(+id);
            req.currentUser = currentUser; // Attach the user to the request object
            next();
        } catch (error) {
            req.currentUser = undefined; // No user is authenticated
            next();
            
        }

    }
}
}

interface JwtPayload {
    id: string;
}
