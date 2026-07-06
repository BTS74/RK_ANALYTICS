import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'RK Pattarai Admin';
  constructor(private cookie: CookieService, private router:Router) { }

  ngOnInit(): void {
    this.checkAppVersion();
  }

  get isLoginRoute(): boolean {
    return this.router.url === '/login';
  }


  checkAppVersion(): void {
    const currentVersion = environment.appVersion;
    const storedVersion = localStorage.getItem('app_version');

    // If version doesn't match, clear localStorage and update the stored version
    if (storedVersion !== currentVersion) {
      localStorage.clear();
      this.cookie.deleteAll();
      localStorage.setItem('app_version', currentVersion);
    }
  }
}