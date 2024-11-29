import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from 'src/users/schemas/user.schema';

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UserDocument | undefined => {
        const request = ctx.switchToHttp().getRequest();
        return request.user as UserDocument | undefined;
    },
);
