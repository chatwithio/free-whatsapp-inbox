import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/services/auth.service';

export const inboxTokenInterceptor: HttpInterceptorFn = (req, next) => {
    // No añadir token a la ruta de login
    if (req.url.includes('/auth/login')) {
        return next(req);
    }

    // Solo añadir token a peticiones del inbox API
    if (req.url.startsWith(environment.inboxApiBaseUrl)) {
        const authService = inject(AuthService);
        const token = authService.getToken();

        if (token) {
            req = req.clone({
                setHeaders: {
                    'INBOX-SERVICES-TOKEN': token
                }
            });
        }
    }

    return next(req);
};