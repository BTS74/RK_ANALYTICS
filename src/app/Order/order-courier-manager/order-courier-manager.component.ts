import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { OrderModel } from 'src/app/Data/cart';
import { filter } from 'src/app/Model/orderFilter';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';
import { Observable, Subject, Subscription } from 'rxjs'

@Component({
  selector: 'app-order-courier-manager',
  templateUrl: './order-courier-manager.component.html',
  styleUrls: ['./order-courier-manager.component.css']
})
export class OrderCourierManagerComponent implements OnInit, OnDestroy {

  public filtre = {} as filter;
  submitted: boolean[] = [false, false];
  public pageDetails: number = 0;
  private actRoute_subscription: Subscription;
  previewOrderList: Subject<void> = new Subject<void>();
  printOrderList: any = [];
  valueToBeUpdate: any = {};
  public form1!: FormGroup;
  public form2!: FormGroup;
  public config = {
    itemsPerPage: 10,
    currentPage: 0,
    totalItems: 0
  };
  orderList: OrderModel[] = [];
  allOrders: any[] = []
  courierServiceList: any[] = [];
  listToBeShown: string[] = [];
  tHeaderList: string[] = []

  public refreshTable: Subject<void> = new Subject<void>();
  public modeOdDelivery: string = '';


  constructor(private jsonHttpService: JsonHttpService,
    private formBuilder: FormBuilder,
    private actRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    private confirmationService: ConfirmationService) {

    this.filtre = {
      modeOfDelivery: "Courier",
      orderStatus: "dispatched",
      paymentStatus: "captured"
    }

    this.getHeaderValues()

    this.actRoute_subscription = this.actRoute.queryParams.subscribe((params: any) => {
      if (!params.page) {
        this.getAllOrders()
        return;
      }

      this.config.currentPage = Number(params.page) + 1;
      this.getAllOrders(params.page)
    })

  }
  getHeaderValues() {
    this.tHeaderList = ['S.No',
      'Order ID',
      'Name',
      'Phone No',
      '(A)Phone No',
      'Order Received on',
      'Total Amount',
      'Payment Status',
      'Order Status',
      'Dispatched date', 'Comments',
      'Courier Service',
      'Tracking No',
      'Courier Action']
  }
  ngOnDestroy(): void {
    this.actRoute_subscription.unsubscribe();
  }



  ngOnInit(): void {
    this.form1 = this.formBuilder.group({
      deliveryStartDate: ['', Validators.required],
      deliveryEndDate: ['',],
    });

    this.form2 = this.formBuilder.group({
      courierProvider: ['', Validators.required],
      courierTrackingNo: ['', Validators.required]
    });

    this.getAllCourierProviders();
  }

  get filterDateCheck(): { [key: string]: AbstractControl } {
    return this.form1.controls;
  }

  get courierCheck(): { [key: string]: AbstractControl } {
    return this.form2.controls;
  }



  getOverAllStats() {
    this.submitted[0] = true;
    if (this.form1.invalid) {
      return
    }
    this.getAllOrders();
  }

  getAllOrders(pageNo = 0) {
    this.jsonHttpService.FetchAllOrderWithFilters(pageNo, this.filtre).subscribe((data: any) => {
      if (data.data.length >= 1) {
        this.orderList = data.data[0].content;
        this.config.totalItems = data.data[0].totalElements
      }
    })
  }

  getAllCourierProviders() {
    this.jsonHttpService.FetchAllCourier(0).subscribe({
      next: (value: any) => {
        this.courierServiceList = value.data[0].content;
      }
    })
  }

  updateCourieAction(data: any) {
    switch (data.Action) {
      case 'onInputChange':
        this.onInputChange(data.event, data.value);
        break;
      case 'optionsChange':
        this.optionsChange(data.data, data.value);
        break;
    }
  }

  optionsChange(data: any, value: OrderModel) {
    this.valueToBeUpdate.orderId = value.orderId;
    this.valueToBeUpdate.courierDetails = { ...this.valueToBeUpdate.courierDetails, 'courierProvider': data.value };
  }


  onInputChange(event: any, value: OrderModel) {
    const inputValue = event.target.value;
    this.valueToBeUpdate.orderId = value.orderId;
    this.valueToBeUpdate.courierDetails = { ...this.valueToBeUpdate.courierDetails, 'courierTrackingNo': inputValue };
  }

  updateTracking(value: OrderModel) {
    this.jsonHttpService.updateTrackingNo(value).subscribe({
      next: (value: any) => { }
    })
  }

  async update(value?: OrderModel) {

    if (!this.valueToBeUpdate.courierDetails?.courierProvider || !this.valueToBeUpdate?.courierDetails.courierTrackingNo) {
      return;
    }

    if (await this.confirm()) {
      this.updateTracking(this.valueToBeUpdate)
    }
  }

  pageChangeEvent(event: any) {
    this.router.navigate(['/order-update-courier'], { queryParams: { page: event - 1 } });
  }

  dateTransform() {
    const currentDate = new Date();
    return this.datePipe.transform(currentDate, 'yyyy-MM-dd');
  }

  confirm(): Promise<boolean> {
    return new Promise(resolve => {
      this.confirmationService.confirm({
        message: "Are you sure that you want to proceed?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          resolve(true);
        },
        reject: () => {
          resolve(false);
        }
      })
    });
  }

  search(value: string) {
    this.jsonHttpService.FetchOrderByIdForCourier(value.trim()).subscribe({
      next: (data: any) => {
        this.orderList = data.data[0].content;
        this.config.totalItems = data.data[0].totalElements
      }, error: error => {
        this.orderList = []
      }
    })
  }

  previewOrderListOut(data: any) {
    this.printOrderList = data;
    setTimeout(() => { this.previewOrderList.next(); }, 100)
  }

  nextPage(data: any) {
    console.log("order-update page", data);
    this.router.navigate(['/order-update-courier'], { queryParams: { page: data } });
  }

  refreshPageForUpdates(data: any) {
    console.log("page");
  }

}
