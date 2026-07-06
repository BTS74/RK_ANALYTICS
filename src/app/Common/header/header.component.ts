import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() showHeader?: boolean = true;
  categories: any[] = [];

  constructor(private router: Router, private jsonHttpService: JsonHttpService, private cookieService: CookieService) { }

  ngOnInit(): void {
  }

  signOut() {
    this.cookieService.deleteAll();
    this.router.navigate(['/login']);
  }


  async routeTo(whatTodo: string) {
    switch (whatTodo) {
      case 'sign-out':
        this.signOut();
        break;

  
      default:
        break;
    }
  }

  openSideBar() {
    this.jsonHttpService.openSideBarMenu();
  }
}
