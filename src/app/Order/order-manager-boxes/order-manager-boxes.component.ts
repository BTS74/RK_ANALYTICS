import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, Subscription, interval } from 'rxjs';
import { filter } from 'src/app/Model/orderFilter';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';

import { WebsocketService } from 'src/app/services/Websocket/websocket.service';
import { switchMap, takeWhile } from 'rxjs/operators';

export interface statDetails {
  totalCancelledOrders?: number;
  totalDispatchedOrders?: number;
  totalNewOrders?: number;
  totalRevenue?: number;
  totalNoOfParcel: number;
  totalNoOfCourier: number;
  totalNoOfCourierDispatched: number
  totalNoOfCourierPending: number
  totalNoOfDoorDelivery: number
  totalNoOfDoorDeliveryDispatched: number
  totalNoOfDoorDeliveryPending: number
  totalNoOfParcelDispatched: number
  totalNoOfParcelPending: number
  totalNoOfDoorDeliveryDispatchedTdy: number
  totalNoOfParcelDispatchedTdy: number
  totalNoOfCourierDispatchedTdy: number
  totalNoOfPlantsDispatchedTdy: number
  totalNoOfABSDispatchedTdy: number
}

@Component({
  selector: 'app-order-manager-boxes',
  templateUrl: './order-manager-boxes.component.html',
  styleUrls: ['./order-manager-boxes.component.css']
})
export class OrderManagerBoxesComponent implements OnInit, OnDestroy {
  numbers: any = [];
  @Input() boxTitle: string | undefined;
  @Input() modeOfDelivery: string | undefined = "All";

  public filtre = {} as filter | any;
  public gstFiltre = {} as filter;
  // router_subscription: Subscription;
  query_subscription: Subscription;
  public stats = {} as statDetails;
  public form1!: FormGroup;
  public allOrders: any = [];
  public pageDetails: number = 0;
  public config: any = {};
  submitted = false;
  jobId: string = '';

  private pollSub: Subscription | any;

  public refreshTable: Subject<void> = new Subject<void>();
  private messagesSubscription: Subscription | undefined;
  public show = [true, false, false, false];
  typeOfProduct: string = '';
  tHeaderList: string[] = [];

  constructor(private jsonHttpService: JsonHttpService, private webSocket: WebsocketService,
    private formBuilder: FormBuilder, private datePipe: DatePipe,
    private router: Router, private actRoute: ActivatedRoute) {

    this.getHeaderValues();


    this.query_subscription = this.actRoute.queryParams.subscribe((params: any) => {

      this.config.currentPage = params.page ? Number(params.page) : 0;
      // this.filtre.orderStartDate = params.date ? params.date : this.dateTransform(new Date());
      this.filtre = {
        invoiceStartDate: params.invoiceStartDate ?? null,
        invoiceEndDate: params.invoiceEndDate ?? null,
        userGstIn: params.userGstIn ?? null,
        orderStatus: params.orderStatus ?? null
      }



      this.routePathChangeDetects();
    });

    // this.router_subscription = this.router.events.subscribe((event: any) => {
    //   if (event instanceof NavigationEnd) {
    //     // this.getActiveState();
    //   }
    // })

  }
  get checkFilter(): { [key: string]: AbstractControl } {
    return this.form1.controls;
  }


  routePathChangeDetects() {

    if (this.filtre.invoiceStartDate && this.filtre.invoiceEndDate) {

      if (this.filtre.orderStatus === 'refundInitiatedManually') {
        this.getAllRefunds();
      } else {
        this.getAllOrders();
      }
    }
  }



  ngOnDestroy(): void {
    // this.router_subscription && this.router_subscription.unsubscribe();
    this.query_subscription && this.query_subscription.unsubscribe();
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    this.webSocket.disconnect();
  }

  ngOnInit(): void {

    this.form1 = this.formBuilder.group({
      invoiceStartDate: ['', [Validators.required]],
      invoiceEndDate: ['', [Validators.required]],
      userGstIn: [''],
      orderStatus: [''],
    });

    // this.getOverAllStats();
    // this.getWebSocketOpen();

    const invoiceStartDate = this.form1.get('invoiceStartDate');
    invoiceStartDate?.setValue(this.filtre.invoiceStartDate);
    const invoiceEndDate = this.form1.get('invoiceEndDate');
    invoiceEndDate?.setValue(this.filtre.invoiceEndDate);
    const userGstIn = this.form1.get('userGstIn');
    userGstIn?.setValue(this.filtre.userGstIn);
    const orderStatus = this.form1.get('orderStatus');
    orderStatus?.setValue(this.filtre.orderStatus);

  }

  dateTransform(dataToTransform: any) {
    return this.datePipe.transform(dataToTransform, 'yyyy-MM-dd');
  }

  showFilters(toReset?: string) {
    if (toReset === 'reset') {

      this.router.navigate([], {
        relativeTo: this.actRoute,
        queryParams: {
          ...this.filtre, userGstIn: null, orderStatus: null,
          page: 0
        },
        queryParamsHandling: 'merge'
      });

      const userGstIn = this.form1.get('userGstIn');
      userGstIn?.setValue(null);
      const orderStatus = this.form1.get('orderStatus');
      orderStatus?.setValue(null);
      return;
    }
    this.submitted = true;
    if (this.form1.invalid) { return }

    this.router.navigate([], {
      relativeTo: this.actRoute,
      queryParams: {
        ...this.filtre, ...this.form1.getRawValue(),
        page: 0
      },
      queryParamsHandling: 'merge'
    });

    // this.getOverAllStats();
  }

  // getOverAllStats() {
  //   this.jsonHttpService.FetchOrderStatsBydate(this.filtre).subscribe((data: any) => {
  //     this.stats = data.data[0]
  //   })
  // }


  getAllOrders() {
    let filter = {
      ...this.filtre, user: { 'gstIn': this.filtre.userGstIn }
    }

    this.jsonHttpService.FetchAllOrderWithFilter(this.config.currentPage, filter, 'invoiceSequence', 'asc').subscribe((data: any) => {
      if (data.data.length >= 1) {
        this.allOrders = data.data[0].content;
        this.pageDetails = data.data[0]?.totalElements
      }
    })
  }

  getAllRefunds() {
    this.jsonHttpService.FetchAllRefundOrderWithFilters(this.config.currentPage, {
      orderStartDate: this.filtre.invoiceStartDate, orderEndDate: this.filtre.invoiceEndDate,
    }).subscribe(
      {
        next: (data: any) => {
          this.allOrders = data.data[0].content;
          this.pageDetails = data.data[0]?.totalElements;
        }, error: () => {
          this.allOrders = [];
        }
      })
  }
  nextPage(data: any) {

    this.router.navigate([], {
      relativeTo: this.actRoute,
      queryParams: {
        ...this.filtre, ...this.form1.getRawValue(),
        page: data
      },
      queryParamsHandling: 'merge'
    });


    // this.router.navigate(['/order-manager'], { queryParams: this.setDynamicQueryParams(data) });
  }

  // setDynamicQueryParams0(pageNumber: number = 0) {
  //   return this.filtre.orderStartDate ? { page: pageNumber, date: this.filtre.orderStartDate } : { page: pageNumber }
  // }

  // setDynamicQueryParams(pageNumber: number = 0) {
  //   const params: { page: number; invoiceStartDate?: string, invoiceEndDate?: string } = { page: pageNumber };

  //   if (this.filtre.invoiceStartDate) {
  //     params.invoiceStartDate = this.filtre.invoiceStartDate;
  //   }

  //   if (this.filtre.invoiceEndDate) {
  //     params.invoiceEndDate = this.filtre.invoiceEndDate;
  //   }

  //   return params;
  // }


  getOrderReport() {
    this.submitted = true;
    if (this.form1.invalid) { return }

    this.jsonHttpService.FetchReports(this.filtre).subscribe({
      next: (response: HttpResponse<Blob>) => {
        // Extract file name from the Content-Disposition header
        const contentDisposition = response.headers.get('content-disposition');
        let fileName = 'order_reports_' + this.form1.getRawValue().invoiceStartDate + '.xlsx'; // Fallback name
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match) {
            fileName = match[1];
          }
        }

        // Create a link element for the download
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(response.body!);
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error fetching the report:', err);
      }
    });
  }

  getGSTOrderReport() {
    let filter = {
      ...this.form1.getRawValue(), user: { 'gstIn': this.form1.getRawValue().userGstIn }
    }

    this.jsonHttpService.startExportGST(filter, true, 'All').subscribe(jobId => {
      this.jobId = jobId;
      this.jsonHttpService.sendToastMessage("", 'Export in progress...', "success");

      // Start polling every 2 seconds
      this.pollSub = interval(2000).pipe(
        switchMap(() => this.jsonHttpService.getExportStatus(this.jobId)),
        takeWhile(job => job.status === 'PROCESSING', true) // keep polling until completed or failed
      ).subscribe(job => {
        if (job.status === 'COMPLETED') {

          this.jsonHttpService.sendToastMessage("", 'Export completed! Downloading...', "success");
          this.downloadFile();
          this.pollSub.unsubscribe();
        } else if (job.status === 'FAILED') {
          this.jsonHttpService.sendToastMessage('GST report export failed. Please try again later.', 'Export Failed', 'failure');
          this.pollSub.unsubscribe();
        }
      });
      // }, error: (err: any) => {
      //     console.error('Error fetching the report:', err);
      //   }
      // });
      // Extract file name from the Content-Disposition header
      // const contentDisposition = response.headers.get('content-disposition');
      // let fileName = 'gst_order_reports_' + this.filtre.invoiceStartDate + '.xlsx'; // Fallback name
      // if (contentDisposition) {
      //   const match = contentDisposition.match(/filename="(.+)"/);
      //   if (match) {
      //     fileName = match[1];
      //   }
      // }

      // // Create a link element for the download
      // const link = document.createElement('a');
      // const url = window.URL.createObjectURL(response.body!);
      // link.href = url;
      // link.download = fileName;
      // link.click();
      // window.URL.revokeObjectURL(url);
      //   },
      //   error: (err: any) => {
      //     console.error('Error fetching the report:', err);
      //   }
      // });

    });
  }

  downloadFile() {
    this.jsonHttpService.downloadGSTFile(this.jobId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'report.xlsx'; // or derive from server
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

  // getOrdersByModeOfDelivey(status: string) {
  //   this.typeOfProduct = status;
  //   switch (status) {
  //     case "Courier":
  //     case "Parcel":
  //       this.filtre.isCallConnected = null;
  //       break;
  //   }
  //   this.router.navigate(['/order-manager'], { queryParams: this.setDynamicQueryParams() });
  //   this.refreshTable.next();
  // }

  activeState(status: string | null) {
    switch (status) {
      // case "All":
      //   this.filtre.modeOfDelivery = status;
      //   this.show = [true, false, false, false];
      //   break;
      case "Courier":
        this.filtre.modeOfDelivery = status;
        delete this.filtre.typeOfProduct;
        this.show = [false, true, false, false];
        break;
      case "Parcel":
        this.filtre.modeOfDelivery = status;
        delete this.filtre.typeOfProduct;
        this.show = [false, false, true, false];
        break;
      case "DoorDelivery":
        this.filtre.modeOfDelivery = status;
        delete this.filtre.typeOfProduct;
        this.show = [false, false, false, true];
        break;
      case "order-overview":
        this.show = [true, false, false, false];
        break;

      case "Plants":
        this.filtre.typeOfProduct = status;
        delete this.filtre.modeOfDelivery;
        this.show = [false, false, false, false, true, false]
        break;

      case "ABS Stand":
        this.filtre.typeOfProduct = status;
        delete this.filtre.modeOfDelivery;
        this.show = [false, false, false, false, false, true]
        break;

    }
  }

  getHeaderValues() {
    this.tHeaderList = ['S.No',
      'Invoice Id',
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
      'Comments',
      'Call Connected',
      'Completed',
      'Tracking',
      'Delivery Type'

    ]
  }

}
