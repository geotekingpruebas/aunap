import { Component } from '@angular/core';
import { AppComponent} from '../app.component';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    constructor(public app: AppComponent, private authService: AuthService, private router: Router) {}

    logout() {
      this.authService.logout();
      this.router.navigate(['/login']);
  }
}
