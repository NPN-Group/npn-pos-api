import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { LoginDtoSchema } from "../dtos/login.dto";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const authValidation = LoginDtoSchema.parse({
            email: request.body.email,
            password: request.body.password
        })
        console.log('LocalAuthGuard', authValidation);
        return super.canActivate(context);
    }
}