import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserRole } from '../../users/enums/user-role.enum';

interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
        .switchToHttp()
        .getRequest<AuthenticatedRequest>();

        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid token');
        }

        try {
            const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

            if (!payload.sub || !Object.values(UserRole).includes(payload.role)) {
                throw new UnauthorizedException();
            }

            request.user = {
                sub: payload.sub,
                role: payload.role,
            };

            return true;
        } catch {
            throw new UnauthorizedException('Invalid token or expired');
        }
    }
}