import { Component, OnDestroy, OnInit } from '@angular/core';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { filter as filterModel } from '../../Model/orderFilter';
import { Subject, Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AnalyticsFilterModel, SalesDataResponse } from 'src/app/Model/analytics';

interface statDetails {
  totalCancelledOrders: number;
  totalDispatchedOrders: number;
  totalNewOrders: number;
  totalRevenue: number;
}

type Courier = {
  courierId?: string;
  courierProvider?: string;
  courierProviderDeleted?: boolean;
  trackingLink: string;
  createdOn?: Date;
  editedOn?: Date;
}

@Component({
  selector: 'app-order-over-view',
  templateUrl: './order-over-view.component.html',
  styleUrls: ['./order-over-view.component.css']
})

export class OrderOverViewComponent implements OnInit, OnDestroy {
  public allOrders: any = [];
  public form1!: FormGroup;
  public submitted = false;
  public stats: statDetails = {
    totalCancelledOrders: 0,
    totalDispatchedOrders: 0,
    totalNewOrders: 0,
    totalRevenue: 0
  };
  public filtre = {} as filterModel

  public refreshTable: Subject<void> = new Subject<void>();

  public pageDetails: number = 0;
  public config = {
    itemsPerPage: 0,
    currentPage: 0,
    totalItems: 0,
    phoneNo: 0,
    pageNo: 0
  };

  public show = [false, false, false, false];
  public modeOdDelivery: string = '';
  public typeOfProduct: boolean = false;
  public orderType: string = '';
  public order_type: string = '';
  public searchValue: string = '';
  router_subscription: any;
  tHeaderList: string[] = [];
  courierServiceList: Courier[] = [];
  salesData = {} as SalesDataResponse;
  orderFiltredValues = {}
  private actRoute_subscription: Subscription;
  interNALState: boolean = false;
  screenWizardCapturedPayment: boolean = true;

  constructor(private jsonHttpService: JsonHttpService,
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private datePipe: DatePipe,
    private router: Router,
    private actRoute: ActivatedRoute) {

    this.getHeaderValues();



    this.actRoute_subscription = this.actRoute.queryParams.subscribe((params: any) => {

      this.filtre = {
        modeOfDelivery: params.modeOfDelivery ?? null,
        typeOfProduct: params.typeOfProduct ?? null,
        paymentStatus: params.paymentStatus ?? '',
        orderStartDate: params.paymentStatus == 'processing' ? null : params.orderStartDate ?? '',
        invoiceStartDate: params.paymentStatus == 'processing' ? params.invoiceStartDate ?? '' : null,
        startDate: params.startDate ?? '',
        billPrinted: params.billPrinted ?? null
      }

      if (params.paymentStatus == 'processing') {
        this.initTHeader();
      } else {
        this.getHeaderValues();
      }

      this.config.pageNo = params['page'] ?? 0;
      if (this.interNALState) {
        this.interNALState = false;
        return;
      }

      this.screenWizardCapturedPayment = params.paymentStatus == 'captured';
      if (!this.screenWizardCapturedPayment) {
        this.filtre.invoiceStartDate = this.filtre.startDate;
      } else {
        this.filtre.orderStartDate = this.filtre.startDate;
      }


      this.routePathChangeDetects();
    });

  }

  initTHeader() {
    this.tHeaderList = ['S.No',
      'Invoice Date',
      'Actions',
      'Order ID',
      'Name',
      'Phone No',
      'Order Received on',
      'Total Amount',
    ]
  }

  // this.router_subscription = this.router.events.subscribe((event: any) => {

  //   if (event instanceof NavigationEnd) {
  //     if (event.url.includes('order-type'))
  //       this.typeOfProduct = true

  //     this.modeOdDelivery = this.actRoute.snapshot.params['modeOdDelivery'];
  //     this.orderType = this.actRoute.snapshot.params['orderType'];
  //     this.order_type = this.actRoute.snapshot.params['order_type'];
  //     const currentQueryParams = this.actRoute.snapshot.queryParams;

  //     this.config.phoneNo = currentQueryParams['phone'];
  //     this.config.pageNo = currentQueryParams['page'];
  //     this.config.currentPage = Number(currentQueryParams['page']);
  //     // if (currentQueryParams['enableCall'])
  //     //   this.filtre.enableCallConnected = JSON.parse(currentQueryParams['enableCall'])
  //     // if (currentQueryParams['call_Connected'])
  //     //   this.filtre.isCallConnected = JSON.parse(currentQueryParams['call_Connected'])

  //     // show the current mode of delivery
  //     this.activeState(this.typeOfProduct ? this.order_type : this.modeOdDelivery);

  //     if (this.config.phoneNo) {
  //       let orderSearch: any = { user: { phone: this.config.phoneNo } };
  //       this.getOrdersByPhoneNo(orderSearch, this.config.pageNo)
  //       return;
  //     }
  //     this.filtre.modeOfDelivery = this.modeOdDelivery;
  //     this.filtre.paymentStatus = 'captured';
  //     // check for cookie for filtre values, if present it'll use that coz while changinf page total amount needs to be maintained
  //     // if (this.cookieService.check('filterValue')) {
  //     //   let filtre: filterModel = JSON.parse(this.cookieService.get('filterValue'))
  //     //   // this.filtre.maxTotalAmount = filtre.maxTotalAmount;
  //     //   // this.filtre.minTotalAmount = filtre.minTotalAmount;
  //     //   this.filtre.isCallConnected = filtre.isCallConnected ?? false;
  //     //   this.filtre.enableBillPrinted = filtre.enableBillPrinted;
  //     //   this.filtre.billPrinted = filtre.billPrinted;
  //     // } else {
  //     //   // this.filtre.maxTotalAmount = 50000;
  //     //   // this.filtre.minTotalAmount = 0;
  //     //   this.filtre.isCallConnected = false;
  //     //   this.filtre.enableBillPrinted = false;
  //     //   delete this.filtre.billPrinted;
  //     // }
  //     if (this.modeOdDelivery == 'All') {
  //       this.filtre.modeOfDelivery = null;
  //     }


  //     // 
  //     // this.getAllOrders();
  //     // this.getOverAllStats();   
  //   }
  // });


  routePathChangeDetects() {
    this.activeState(this.filtre.modeOfDelivery != null ? this.filtre.modeOfDelivery as string : this.filtre.typeOfProduct)
    if (this.filtre.orderStartDate)
      this.getAnalytics();
    if (this.filtre.orderStartDate || this.filtre.invoiceStartDate) {
      this.getAllOrdersWithFilters();
    }
  }

  getAllOrdersWithFilters() {
    this.jsonHttpService.FetchAllOrderAnalyticsWithFilters(this.config.pageNo, this.filtre, this.filtre.paymentStatus).subscribe({
      next: (data: any) => {
        this.allOrders = data.data[0].content;
        this.pageDetails = data.data[0].totalElements;
        // this.refreshTable.next();
      }, error: error => {

      }
    });
  }

  ngOnDestroy(): void {
    // this.router_subscription.unsubscribe();
    this.actRoute_subscription.unsubscribe();
  }


  ngOnInit(): void {
    this.form1 = this.formBuilder.group({
      startDate: ['', Validators.required],
    });
  }


  dateTransform(dataToTransform: any) {
    return this.datePipe.transform(dataToTransform, 'yyyy-MM-dd');
  }

  get hasValue(): boolean {
    return Object.values(this.filtre).some(value => value != null && value !== '');
  }


  get filterCheck(): { [key: string]: AbstractControl } {
    return this.form1.controls;
  }

  /* when status changes page need to update stats and table value*/

  // refreshPage() {
  // this.getOverAllStats();
  // this.getAllOrders(0)
  // }

  // checkFilterEnabled() {
  //   if (this.cookieService.check('filterValue')) {
  //     this.filtre = JSON.parse(this.cookieService.get('filterValue'))
  //     this.filterGetCall(0);
  //     document.getElementById("orderFilterBar")!.style.display = "block";
  //   }
  // }

  getAllCourierProviders() {
    this.jsonHttpService.FetchAllCourierWithouPagination().subscribe({
      next: (value: any) => {
        this.courierServiceList = value.data[0].content;
      }
    })
  }

  getAllOrders() {
    if (this.orderType || this.typeOfProduct) {
      // delete this.filtre.maxTotalAmount;
      // delete this.filtre.minTotalAmount;
      if (this.orderType == "pending") this.filtre.isPending = true
      else delete this.filtre.isPending
      if (this.orderType == "tracking") {
        this.filtre.isOrderTrackingCompleted = true;
        delete this.filtre.isCallConnected;
      }
      else delete this.filtre.isOrderTrackingCompleted
      if (this.order_type == "Plants" || this.order_type == "ABS Stand" || this.order_type == "New Garden Setup") {
        this.filtre.typeOfProduct = this.order_type;
        // this.filtre.isCallConnected = false
      }
    }

    this.jsonHttpService.FetchAllOrderWithFilters(this.config.currentPage, this.filtre).subscribe(
      {
        next: (data: any) => {
          if (data.data.length >= 1) {
            this.allOrders = data.data[0].content;
            this.pageDetails = data.data[0]?.totalElements;
          }
        }, error: () => {

        }
      })
  }

  getOrdersViaFilters() {
    this.submitted = true;
    if (this.form1.invalid) {
      return;
    }
    if ((this.filtre.modeOfDelivery == '' || this.filtre.modeOfDelivery == null) && (this.filtre.typeOfProduct == '' || this.filtre.typeOfProduct == null)) {
      this.jsonHttpService.sendToastMessage('Please select Mode of Delivery', '', 'failure');
      return;
    }
    this.router.navigate([], {
      relativeTo: this.actRoute,
      queryParams: {
        ...this.filtre, invoiceStartDate: null, orderStartDate: this.filtre['orderStartDate'], page :0
      },
      queryParamsHandling: 'merge'
    });
  }

  getFilterValue(type: string) {
    switch (type) {
      case 'apply':
        this.getOrdersViaFilters();
        break;

      case 'clear':
        // this.filtre['orderStatus'] = null;
        // this.filtre['orderDate'] = null;
        // this.filtre['paymentStatus'] = null;
        this.filtre = {}
        this.filtre.modeOfDelivery = this.modeOdDelivery;
        // this.filtre.isCallConnected = false; // to improve performance , since db using indexes
        this.cookieService.delete('filterValue')
        this.config.currentPage = 0;
        this.getAllOrders()
        break;

      default:
        // this.config.currentPage = 0;
        // this.getAllOrders();
        break;
    }

  }

  // enableOrDisableFilter() {
  //   let styleCheck = document.getElementById("orderFilterBar")!.style.display
  //   if (styleCheck == '' || styleCheck == 'block') {
  //     document.getElementById("orderFilterBar")!.style.display = "none";
  //   } else {
  //     document.getElementById("orderFilterBar")!.style.display = "block";
  //   }
  // }

  getOrderById(orderId: string, pageNo?: number) {
    this.searchValue = orderId;
    if (orderId) {
      if (orderId.includes('ORD')) {
        this.jsonHttpService.FetchOrderById(orderId).subscribe({
          next: (data: any) => {
            this.allOrders = data.data;
            this.pageDetails = data.data.length;
          }, error: error => {
            this.allOrders = []
          }
        })
      } else {
        // this.config.phoneNo = parseInt(orderId);
        // const currentQueryParams = this.actRoute.snapshot.queryParams;
        // const modifiedQueryParams = {
        //   ...currentQueryParams,
        //   phone: this.config.phoneNo,
        //   page: pageNo ? pageNo : 0,
        // };

        // this.router.navigate([], {
        //   relativeTo: this.actRoute,
        //   queryParams: modifiedQueryParams, skipLocationChange: false
        // });

        this.router.navigate([], {
          relativeTo: this.actRoute,
          queryParams: { ...this.filtre, page: 0 },
          queryParamsHandling: 'merge'
        });
        this.interNALState = true;

        this.getOrdersByPhoneNo(0)
      }

    } else {
      this.getAllOrders()
    }
  }

  getOrdersByPhoneNo(pageNo: number) {

    let orderSearch: any = { user: { phone: this.searchValue } };
    this.jsonHttpService.fetchOrderByPhoneNumber(orderSearch, pageNo).subscribe({
      next: (data: any) => {
        this.allOrders = data.data[0].content;
        this.pageDetails = data.data[0].totalElements;
      }, error: error => {
        this.allOrders = []
      }
    })
  }

  enableBillPirnted() {
    this.filtre.enableBillPrinted = !this.filtre.enableBillPrinted;
    if (!this.filtre.enableBillPrinted) {
      delete this.filtre.billPrinted
    } else {
      this.filtre.billPrinted = true;
    }
  }

  // enableCallConnected() {
  //   this.filtre.enableCallConnected = !this.filtre.enableCallConnected;
  //   if (!this.filtre.enableCallConnected) {
  //     delete this.filtre.isCallConnected
  //   } else {
  //     this.filtre.isCallConnected = true;
  //   }
  // }

  getOrdersByFilters(pageNo: number) {
    this.cookieService.set('filterValue', JSON.stringify(this.filtre))
    this.filterGetCall()
  }

  optionsChange(data: any) {
    this.filtre['orderStatus'] = data.value;
  }

  ordertypeFilter() {
    // delete this.filtre.maxTotalAmount;
    // delete this.filtre.minTotalAmount;
  }

  filterGetCall() {
    // let route = !this.orderType ? '/order/' : '/order/' + this.orderType + '/';
    // 

    // if (this.order_type)
    // this.ordertypeFilter();

    this.router.navigate([this.constructRoute()], { queryParams: { page: 0 } })
    this.jsonHttpService.FetchAllOrderWithFilters(0, this.filtre).subscribe({
      next: (data: any) => {
        this.allOrders = data.data[0].content;
        this.pageDetails = data.data[0].totalElements;
        this.refreshTable.next();
      }, error: error => {

      }
    });
  }




  refreshPageForUpdates(data: any) {

    if (!this.searchValue?.trim()) {
      this.getAllOrders();
      // this.getOverAllStats();
      return
    }

    const currentQueryParams = this.actRoute.snapshot.queryParams;
    this.getOrderById(this.searchValue, currentQueryParams['page']);
  }

  nextPage(data: any) {
    if (!this.searchValue?.trim()) {
      this.router.navigate([], {
        relativeTo: this.actRoute,
        queryParams: { ...this.filtre, page: data },
        queryParamsHandling: 'merge'
      });
    } else {
      this.getOrdersByPhoneNo(data)
    }
  }

  getParams(pageNo: number) {
    const currentQueryParams = this.actRoute.snapshot.queryParams;
    this.router.navigate([], {
      relativeTo: this.actRoute,
      queryParams: { ...currentQueryParams, page: pageNo }
    });
    return currentQueryParams['phone'];
  }

  constructRoute(): string {
    if (!this.orderType && !this.order_type) {
      return '/order/' + this.modeOdDelivery;
    } else if (this.order_type) {
      return '/order-type/' + this.order_type;
    } else {
      return '/order/' + this.orderType + '/' + this.modeOdDelivery;
    }
  }

  search(value: string | any) {
    this.getOrderById(value)
  }


  optionsPaymentChange(data: any) {
    this.filtre['paymentStatus'] = data.value;
  }

  getOverAllStats() {
    this.jsonHttpService.FetchOrderStats(this.filtre.modeOfDelivery ? this.filtre.modeOfDelivery : "All").subscribe((data: any) => {
      this.stats = data.data[0]
    })
  }

  getOrdersByModeOfDeliveyAndPaymentCaptured(status: string | null) {
    const isPlants = status === 'Plants';

    this.router.navigate([], {
      relativeTo: this.actRoute,
      queryParams: {
        ...this.filtre, paymentStatus: 'captured',
        modeOfDelivery: isPlants ? null : status,
        typeOfProduct: isPlants ? status : null,
        page: 0, billPrinted: null
      },
      queryParamsHandling: 'merge'
    });
  }

  getOrdersByTypeOfProductsAndPaymentNotCaptured(status: string | null) {
    const isDoorDelivry = status === 'DoorDelivery';
    this.router.navigate([], {
      relativeTo: this.actRoute,
      queryParams: {
        ...this.filtre, paymentStatus: 'processing',
        modeOfDelivery: isDoorDelivry ? status : null,
        typeOfProduct: isDoorDelivry ? null : status,
        billPrinted: true,
        page: 0
      },
      queryParamsHandling: 'merge'
    });
  }


  getOrdersByModeOfDelivey(status: string | null) {
    let route = !this.orderType ? '/order/' : '/order/' + this.orderType + '/';
    switch (status) {
      case "All":
        this.show = [true, false, false, false];
        this.router.navigate([route + status], { queryParams: { page: 0 } });
        break;
      case "Courier":
        this.show = [false, true, false, false];
        this.router.navigate([route + status], { queryParams: { page: 0 } });
        // this.filtre.isCallConnected = null;
        break;
      case "Parcel":
        this.show = [false, false, true, false];
        this.router.navigate([route + status], { queryParams: { page: 0 } });
        // this.filtre.isCallConnected = null;
        break;
      case "DoorDelivery":
        this.show = [false, false, false, true];
        this.router.navigate([route + status], { queryParams: { page: 0 } })
        break;
      case "order-overview":
        this.show = [true, false, false, false];
        this.router.navigate(['/' + status])
        break;

      case "order-manager":
        this.router.navigate(['/order-manager'], { queryParams: { type: 'Courier', page: 0, date: this.dateTransform(new Date()) } })
        break;
      case "pending":
        this.router.navigate(['/order/pending/' + 'All'], { queryParams: { page: 0 } })
        break;
      case "tracking":
        this.router.navigate(['/order/tracking/' + 'All'], { queryParams: { page: 0 } })
        break;
      case "back":
        if (this.orderType != 'back')
          this.router.navigate(['/order/' + 'All'], { queryParams: { page: 0, date: this.dateTransform(new Date()) } })
        break;

      case "order-preview-unconfirm":
        this.router.navigate(['/order-preview-unconfirm/All'])
        break;

      case "order-update-courier":
        this.router.navigate(['/order-update-courier'])
        break;

      case "Plants":
      case "order-type":
        this.router.navigate(['/order-type/Plants'], { queryParams: { page: 0 } })
        break;

      case "ABS Stand":
        this.router.navigate(['/order-type/ABS Stand'], { queryParams: { page: 0 } })
        break;

      case "New Garden Setup":
        this.router.navigate(['/order-type/New Garden Setup'], { queryParams: { page: 0 } })
        break;
      case "plants-summary":
        this.router.navigate(['/plants-summary'])
        break;
    }
    this.refreshTable.next();
  }


  activeState(status: string | null) {
    const stateMap: Record<string, boolean[]> = {
      "All": [true, false, false, false],
      "Courier": [false, true, false, false],
      "Parcel": [false, false, true, false],
      "DoorDelivery": [false, false, false, true],
      "order-overview": [true, false, false, false],
      "Plants": [false, false, false, false, true, false, false],
      "ABS Stand": [false, false, false, false, false, true, false],
      "New Garden Setup": [false, false, false, false, false, false, true]
    };

    if (status && status in stateMap) {
      this.show = stateMap[status];
    }
  }

  checkValue(event: any) {
    if (event.target.value < 0) {
      event.target.value = 0;
    }
  }

  getHeaderValues() {
    this.tHeaderList = ['S.No',
      'Actions',
      'Order ID',
      'Name',
      'Phone No',
      '(A)Phone No',
      'Order Received on',
      'Total Amount',
      'Charges',
      'Payment Status',
      'Total Weight',
      // 'Edited On',
      'Order Status',
      'Bill Print Status',
      'Dispatched date',
      'Call Connected',
      'Comments',
      'Completed',
      'Refund',
      'Urgent',
      'Tracking',
      'Delivery Type',
      'Transportation Cost',
      'Packing Cost',
      'Lifting Cost',
      'Labour Cost',
      'Parcel Service',
      'Parcel Tracking Id',
      'Parcel Details',
      'Courier Service',
      'Tracking No',
      'Courier Action'
    ]
  }

  getAnalytics() {
    let analyticsFilter = {} as AnalyticsFilterModel;

    analyticsFilter.startDate = `${this.filtre.orderStartDate}T00:00:00`;
    analyticsFilter.endDate = `${this.filtre.orderStartDate}T23:59:59`;

    this.jsonHttpService.FetchCouierAnalytics(analyticsFilter, this.filtre.modeOfDelivery != null ? this.filtre.modeOfDelivery : this.filtre.typeOfProduct).subscribe({
      next: (data: any) => {
        this.salesData = data;
      }, error: () => { this.salesData = {} as SalesDataResponse; }
    });
  }
}
