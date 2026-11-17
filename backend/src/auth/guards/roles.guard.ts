import {
    CanActivate,
    ExecutionContext,
    Injectable
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import {
    Roles,
    ROLES_KEY
} from '../decorators/roles.decorator';

import { UserRole } from '../../users/enums/user-role.enum';

import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ],
        );

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest<{
            user?: JwtPayload;
        }>();

        const user = request.user;

        if (!user) {
            return false;
        }

        return requiredRoles.includes(user.role);
    }
}