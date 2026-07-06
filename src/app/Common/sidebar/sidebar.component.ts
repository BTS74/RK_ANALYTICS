import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() showSideBar?: boolean = true;

  siderActiveIcon = [true, false, false, false, false, false, false];
  router_subscription: any;

  constructor(private router: Router, private location: Location, private JsonHttpService: JsonHttpService) {
    // this.router_subscription && this.router_subscription.unsubscribe()
    // this.router_subscription = this.router.events.subscribe(() => {
    //   this.highLightIcons();
    // });
  }
  ngOnDestroy(): void {
    // this.router_subscription.unsubscribe()
  }

  ngOnInit(): void {

  }

  getCurrentRoute(): string {
    return this.location.path();
  }

  isOrderRoute(value:any): boolean {
    return this.router.url.includes(value);
  }


  navigator(routeTo: string) {

    if (routeTo == 'order-overview') {
      this.router.navigate(['/order/All'], { queryParams: { page: 0 } });
      return;
    }
    else if (routeTo == 'refund') {
      this.router.navigate(['/refund'], { queryParams: { page: 0 } });
      return;
    }
    this.router.navigate([routeTo]);
  }

  openNav() {
    document.getElementById("myNav")!.style.width = "20%";
    document.getElementById("myNav")!.style.opacity = "1";
    document.getElementById('addAnimate')?.classList.add('addAnimate');
    setTimeout(() => {
      document.getElementById('addAnimate')?.classList.remove('addAnimate');
    }, 1000);
  }

  closeNav() {
    document.getElementById("myNav")!.style.opacity = "0";
    setTimeout(() => {
      document.getElementById("myNav")!.style.width = "0%";
    }, 100);
  }

  highLightIcons() {
    let location = this.location.path();
    if (location.includes('/home')) {
      this.siderActiveIcon = [true, false, false, false, false, false];
    } else if (location.includes('/order')) {
      this.siderActiveIcon = [false, true, false, false, false, false];
    }
    else if (location.includes('/products') || location.includes('/product') || location.includes('/all-products')) {
      this.siderActiveIcon = [false, false, true, false, false, false];
    }
    else if (location.includes('/payments')) {
      this.siderActiveIcon = [false, false, false, true, false, false];
    }
    else if (location.includes('/category') || location.includes('/categories') || location.includes('/subcategory')) {
      this.siderActiveIcon = [false, false, false, false, true, false];
    }
    else if (location.includes('/add-category') ||
      location.includes('/add-subcategory') ||
      location.includes('/update-category') ||
      location.includes('/all-categories')) {
      this.siderActiveIcon = [false, false, false, false, true, false];
    } else if (location.includes('/area')) {
      this.siderActiveIcon = [false, false, false, false, false, true];
    } else {
      this.siderActiveIcon = [false, false, false, false, false, false];
    }


    // switch (this.location.path()) {
    //   case '/home':
    //     this.siderActiveIcon = [true, false, false, false, false, false];
    //     break;
    //   case '/order/All':

    //     break;
    //   case '/all-products':
    //   case '/add-products':
    //   case '/update-product/':

    //     break;
    //   case '/payments':

    //     break;
    //   case '/all-categories':
    //   case '/add-category':
    //   case '/add-subcategory':
    //   case '/update-category':

    //     break;
    //   case '/order-preview-unconfirm':
    //     this.siderActiveIcon = [false, false, false, false, false, true];
    //     break;
    //   default:
    //     this.siderActiveIcon = [false, false, false, false, false, false];
    //     break
    // }
    this.router_subscription && this.router_subscription.unsubscribe()
  }

}
