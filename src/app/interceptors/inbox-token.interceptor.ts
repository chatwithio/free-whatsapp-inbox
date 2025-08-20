import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const inboxTokenInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.startsWith(environment.inboxApiBaseUrl)) {
        req = req.clone({
            setHeaders: {
                'INBOX-SERVICES-TOKEN': environment.inboxServicesToken
            }
        });
    }
    return next(req);
};
