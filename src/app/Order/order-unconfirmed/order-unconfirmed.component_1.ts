import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';
import { filter as filterModel } from '../../Model/orderFilter';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ModeOfDeliveryEnum } from 'src/app/Model/products';
import { Subscription } from 'rxjs';
import { ProductNewGardenDetailsModel } from 'src/app/Product/add-new-product/add-new-product.component';

@Component({
  selector: 'app-order-unconfirmed',
  templateUrl: './order-unconfirmed.component.html',
  styleUrls: ['./order-unconfirmed.component.css']
})
export class OrderUnconfirmedComponent implements OnInit, OnDestroy {
  public pageDetails: number = 0;
  public allOrders: any = [];
  printList: any = [];


  public filtre: filterModel = {
    orderDate: null,
    orderStatus: null
  };

  public config = {
    itemsPerPage: 10,
    currentPage: 0,
    totalItems: 0
  };

  private router_subscription: Subscription;
  public show = [true, false, false, false];
  public modeOdDelivery: string = '';
  public updateOrderStatus: any = {};
  public form1!: FormGroup;
  constructor(private jsonHttpService: JsonHttpService,
     private router: Router,
     private actRoute: ActivatedRoute,
     private formBuilder: FormBuilder,
     private cookieService: CookieService) {


    this.actRoute.queryParams.subscribe((params: any) => {
      this.config.currentPage = Number(params.page);
    });

    this.router_subscription = this.router.events.subscribe((event: any) => {

      if (event instanceof NavigationEnd) {
        this.modeOdDelivery = this.actRoute.snapshot.params['modeOdDelivery'];

        // show the current mode of delivery
        this.activeState(this.modeOdDelivery)

        this.filtre.modeOfDelivery = this.modeOdDelivery;
        if (this.modeOdDelivery == 'All') {
          this.filtre.modeOfDelivery = null;
        }
        this.getAllOrders();
      }
    });
  }

  ngOnDestroy(): void {
    this.router_subscription.unsubscribe();
  }

  ngOnInit(): void {
    // this.config = {
    //   itemsPerPage: 10,
    //   currentPage: 1,
    //   totalItems: 0
    // };

    // this.getAllOrders(0)

    this.form1 = this.formBuilder.group({

      status: [''],
      date: [''],
    });
  }


  getAllOrders() {
    this.jsonHttpService.FetchAllUnconfirmedOrderWithFilters(this.config.currentPage, this.filtre).subscribe((data: any) => {
      if (data.data.length >= 1) {
        this.allOrders = data.data[0].content;
        this.pageDetails = data.data[0].totalElements;
        this.config.totalItems = this.pageDetails;
      }
    })
  }

  previewOrderListOut(data: any) {
    this.printList = data;
    document.getElementById('previewProdList')?.click()
  }

  callConnected(data: any) {
    this.updateOrderStatus["isCallConnected"] = true;
    this.updateOrderBillStatusCAll(this.updateOrderStatus, data.orderId);
  }

  updateOrderBillStatusCAll(valueToUpdate: any, data: any) {
    this.jsonHttpService.updateUnconfirmOrderStatus(valueToUpdate, data).subscribe((value: any) => {
      this.getAllOrders()
      this.jsonHttpService.sendToastMessage('Order ID  #' + data, 'Status Updated successfully', "success");
    }, (error: any) => {
      this.jsonHttpService.sendToastMessage(error.error.statusText, '', "failure");
    })
  }


  pageChangeEvent(event: any) {
    this.config.currentPage = event

    this.router.navigate(
      ['/order-preview-unconfirm/' + this.modeOdDelivery],
      { queryParams: { page: event } }
    );
    this.getAllOrders()
  }


  getOrdersByModeOfDelivey(status: string | null) {
    switch (status) {
      case "All":
        this.show = [true, false, false, false];
        this.router.navigate(['/order-preview-unconfirm/' + status], { queryParams: { page: 0 } });
        break;
      case "Courier":
        this.show = [false, true, false, false];
        this.router.navigate(['/order-preview-unconfirm/' + status], { queryParams: { page: 0 } })
        break;
      case "Parcel":
        this.show = [false, false, true, false];
        this.router.navigate(['/order-preview-unconfirm/' + status], { queryParams: { page: 0 } })
        break;
      case "DoorDelivery":
        this.show = [false, false, false, true];
        this.router.navigate(['/order-preview-unconfirm/' + status], { queryParams: { page: 0 } })
        break;
      case "order-overview":
        this.show = [true, false, false, false];
        this.router.navigate(['/' + status])
        break;
    }
  }

  activeState(status: string | null) {
    switch (status) {
      case "All":
        this.show = [true, false, false, false];
        break;
      case "Courier":
        this.show = [false, true, false, false];
        break;
      case "Parcel":
        this.show = [false, false, true, false];
        break;
      case "DoorDelivery":
        this.show = [false, false, false, true];
        break;
      case "order-overview":
        this.show = [true, false, false, false];
        break;
    }
  }

  modeOfDel(data: string) {
    switch (data) {
      case "DoorDelivery":
        return ModeOfDeliveryEnum.DoorDelivery;
      case "Parcel":
        return ModeOfDeliveryEnum.Parcel;
      case "Courier":
        return ModeOfDeliveryEnum.Courier;

      default:
        return '-'
    }
  }

  optionsChange(data: any) {
    this.filtre['orderStatus'] = data.value;
  }

  optionsPaymentChange(data: any) {
    this.filtre['paymentStatus'] = data.value;
  }

  search(value: string) {
    let orderSearch: any = {};
    let prod = { 'phone': value }
    orderSearch['user'] = prod;
    if (!value) {
      this.getAllOrders()
      return;
    }
    if (value.includes('ORD')) {
      this.jsonHttpService.FetchOrderById(value).subscribe((data: any) => {
        this.allOrders = data.data;
        this.pageDetails = data.data.length;
      }, error => {
        this.allOrders = []
      })
    } else {
      let orderSearch: any = {};
      let prod = { 'phone': value }
      orderSearch['user'] = prod;
      this.jsonHttpService.fetchOrderByPhoneNumber(orderSearch, 0).subscribe((data: any) => {
        this.allOrders = data.data[0].content;
        this.pageDetails = data.data[0].totalElements;
      }, error => {
        this.allOrders = []
      })
    }

  }

  getFilterValue(type: string) {
    switch (type) {
      case 'apply':
        this.filterGetCall()
        break;

      case 'clear':
        this.filtre['orderStatus'] = null;
        this.filtre['orderDate'] = null;
        this.filtre['paymentStatus'] = null;
        this.cookieService.delete('filterPreviewValue')
        this.config.currentPage = 0;
        this.getAllOrders()
        break;

      default:
        this.config.currentPage = 0;
        this.getAllOrders();
        break;
    }

  }


  filterGetCall() {
    this.cookieService.set('filterPreviewValue', JSON.stringify(this.filtre))
    this.router.navigate(['/order-preview-unconfirm/' + this.modeOdDelivery], { queryParams: { page: 0 } });
    this.getAllOrders()
  }

  findSingleUnitPrice(data:ProductNewGardenDetailsModel){    
    const garden = data.productModel.productSetupDetails.find((value:ProductNewGardenDetailsModel) => value.growBagName == data.growBagName
     && value.potName == data.potName);     
    return garden
  }

}
