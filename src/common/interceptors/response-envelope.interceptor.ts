import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const path = typeof request === 'object' && request !== null && 'url' in request ? (request as any).url : '';
    return next.handle().pipe(
      map((data) => ({
        success: true,
        path,
        data,
      })),
    );
  }
}
