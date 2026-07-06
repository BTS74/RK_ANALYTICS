import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router,
    private cookieService: CookieService) { }


  canActivate(): boolean {

    if (this.getValues()) {
      return true;
    }

    else {
      this.router.navigate(['/login']);
      return false;
    }

  }

  getValues() {
    if (!this.cookieService.check('loggedIn_1231')) {
      return false
    }
    return true
  }
}
