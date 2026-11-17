import {
    createParamDecorator,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';

import { JwtPayload } from '../interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): JwtPayload => {
        const request = ctx.switchToHttp().getRequest<{
            user?: JwtPayload;
        }>();

        const user = request.user;

        if (!user?.sub || !user?.role) {
            throw new UnauthorizedException();
        }

        return user
    },
);