import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token && !req.url.includes('/auth/login')) {
        req = req.clone({
            setHeaders: {
                'INBOX-SERVICES-TOKEN': token
            }
        });
    }

    return next(req);
};