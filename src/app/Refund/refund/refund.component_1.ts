import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter } from 'src/app/Model/orderFilter';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.css']
})
export class RefundComponent implements OnInit, OnDestroy {
  public allOrders: any = [];
  public pageDetails: number = 0;
  public config = {
    itemsPerPage: 0,
    currentPage: 0,
    totalItems: 0
  };
  public filtre = {} as filter
  tHeaderList: string[] = [];
  public refreshTable: Subject<void> = new Subject<void>();
  router_subscription: any;
  searchResult: any = '';
  forWhichPage:string = "Completed";

  constructor(private JsonHttpService: JsonHttpService, private router: Router, private actRoute: ActivatedRoute) {
    this.actRoute.queryParams.subscribe((params: any) => {
      this.config.currentPage = Number(params.page);
      this.searchResult = params.search;
    })

    this.router_subscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if(event.url.includes("refund")){
          this.forWhichPage = "Refund";
          this.searchResult ? this.getByOrderId() : this.getAllRefunds();
        }else{
          this.forWhichPage = "Completed";
          this.searchResult ? this.getPaymentCompletedByOrderId() : this.getAllPaymentCompletedOrder();
        }       
      }
    })
  }

  ngOnInit(): void {
    this.getHeaderValues();
  }

  ngOnDestroy(): void {
    this.router_subscription.unsubscribe();
  }

  search(value: string) {
    if (!value) {
      this.searchResult = '';
      this.router.navigate([this.navigateBtw()], { queryParams: { page: 0 } });
      return;
    }
    this.router.navigate([this.navigateBtw()], { queryParams: { page: 0, search: value } });
  }

  navigateBtw(){
    if(this.forWhichPage=="Refund")
    return "refund";
    else
    return "completed"
  }

  getByOrderId() {
    this.JsonHttpService.FetchRefundOrderById(this.searchResult, this.config.currentPage).subscribe({
      next: (data: any) => {
        this.allOrders = data.data[0].content;
        this.pageDetails = data.data?.totalElements;
      }, error: () => {
        this.allOrders = [];
      }
    })
  }
  getPaymentCompletedByOrderId() {
    this.JsonHttpService.FetchPaymentCompletedOrderById(this.searchResult, this.config.currentPage).subscribe({
      next: (data: any) => {
        this.allOrders = data.data[0].content;
        this.pageDetails = data.data?.totalElements;
      }, error: () => {
        this.allOrders = [];
      }
    })
  }

  getAllRefunds() {
    this.JsonHttpService.FetchAllRefundOrderWithFilters(this.config.currentPage, this.filtre).subscribe(
      {
        next: (data: any) => {
          this.allOrders = data.data[0].content;
          this.pageDetails = data.data[0]?.totalElements;
        }, error: () => {
          this.allOrders = [];
        }
      })
  }

  getAllPaymentCompletedOrder() {
    this.JsonHttpService.FetchAllPaymentCompletedOrderWithFilters(this.config.currentPage, this.filtre).subscribe(
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
    this.router.navigate([this.navigateBtw()], { queryParams: { page: data } });
  }
  
  refreshPageForUpdates(data: any) {

  }

  getHeaderValues() {
    this.tHeaderList = ['S.No',
    'Actions',
      'Order ID',
      'Name',
      'Phone No',
      'Order Received on',
      'Total Amount',
      'Charges',
      'Payment Status',
      'Bill Print Status',
      'Dispatched date',
      'Comments',
      'Call Connected',
      'Completed',
      'Refund',
      'Tracking',
      'Delivery Type'
    ]
  }

}
