import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SanitizationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.body && typeof request.body === 'object') {
      request.body = this.sanitizeObject(request.body);
    }

    if (request.query && typeof request.query === 'object') {
      request.query = this.sanitizeObject(request.query);
    }

    return next.handle();
  }

  private sanitizeObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        // Strip dangerous XSS script tags and SQL injection patterns
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/onload=/gi, '');
      } else if (typeof obj[key] === 'object') {
        obj[key] = this.sanitizeObject(obj[key]);
      }
    }
    return obj;
  }
}
