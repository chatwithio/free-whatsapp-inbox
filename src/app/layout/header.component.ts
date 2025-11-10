import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    userEmail: string = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        const user = this.authService.getUser();
        this.userEmail = user?.email || 'Usuario';
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}