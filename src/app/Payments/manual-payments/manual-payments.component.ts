import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Subject, Subscription } from 'rxjs';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';

@Component({
  selector: 'app-manual-payments',
  templateUrl: './manual-payments.component.html',
  styleUrls: ['./manual-payments.component.css']
})
export class ManualPaymentsComponent implements OnInit {
  tHeaderList: string[] = [];
  public allOrders: any = [];
  public analyticsFilter: any = {};
  public form1!: FormGroup;
  public submitted = false;
  public page: number = 0;
  salesSummary: any = [];
  show: boolean[] = [false, false, false];
  interNALState: boolean = false;
  private actRoute_subscription: Subscription;
  public refreshTable: Subject<void> = new Subject<void>();
  colors: string[] = ['#FFB7D2', '#FFB7B2', '#FF9AA2', '#FFDAC1'];

  constructor(private jsonHttpService: JsonHttpService, private router: Router, private actRoute: ActivatedRoute,
    private formBuilder: FormBuilder) {

    this.actRoute_subscription = this.actRoute.queryParams.subscribe((params: any) => {

      this.analyticsFilter = {
        paymentStartDate: params.paymentStartDate ?? null,
        paymentEndDate: params.paymentEndDate ?? null,
        paymentMode: params.paymentMode ?? null,
        page: params['page'] ?? 0
      }


      // this.config.pageNo = params['page'] ?? 0;
      if (this.interNALState) {
        this.interNALState = false;
        return;
      }


      this.routePathChangeDetects();
    });


  }

  ngOnInit(): void {

    this.form1 = this.formBuilder.group({
      paymentStartDate: ['', Validators.required],
      paymentEndDate: ['', Validators.required],
    });

    this.getHeaderValues();
  }

  routePathChangeDetects() {
    this.activeState(this.analyticsFilter.paymentMode);
    if (this.analyticsFilter.paymentStartDate && this.analyticsFilter.paymentEndDate) {
      this.filterGetCall(this.analyticsFilter);
      this.getListOfOrders();
    }
  }

  getHeaderValues() {
    this.tHeaderList = ['S.No',
      'Actions',
      'Order ID',
      'Name',
      'Phone No',
      'Order Received on',
      'Total Amount',
      'Comments',
      'Delivery Type'
    ]
  }

  get checkPlantsFilter(): { [key: string]: AbstractControl } {
    return this.form1.controls;
  }

  nextPage(data: any) {

    this.router.navigate([], {
      relativeTo: this.actRoute,
      queryParams: { ...this.analyticsFilter, page: data },
      queryParamsHandling: 'merge'
    });

  }

  getSummary() {
    this.submitted = true;
    if (this.form1.invalid) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.actRoute,
      queryParams: {
        ...this.analyticsFilter, ...this.form1.getRawValue(),
        page: 0
      },
      queryParamsHandling: 'merge'
    });

  }


  filterGetCall(data: any) {
    this.jsonHttpService.getDDANDNGSOrderManager(data).subscribe({
      next: (data: any) => {
        this.salesSummary = data.data;
      }, error: error => {
        this.salesSummary = [];
        this.jsonHttpService.sendToastMessage("", error.error.statusText, "failure")
      }
    });
  }

  getListOfOrders() {
    this.jsonHttpService.getDDANDNGSOrderList(this.analyticsFilter).subscribe({
      next: (data: any) => {
        this.allOrders = data.data[0].content;
        this.page = data.data[0].totalElements;
        this.refreshTable.next();
      }, error: error => {
        this.allOrders = [];
        this.jsonHttpService.sendToastMessage("", error.error.statusText, "failure")
      }
    });
  }
  getOrdersByPaymentMode(paymentMode: string) {

    this.router.navigate([], {
      relativeTo: this.actRoute,
      queryParams: {
        ...this.analyticsFilter, paymentMode: paymentMode,
        page: 0
      },
      queryParamsHandling: 'merge'
    });
  }


  activeState(status: string | null) {
    const stateMap: Record<string, boolean[]> = {
      "UPI": [true, false, false],
      "NET_BANKING": [false, true, false],
      "CASH": [false, false, true]
    };

    if (status && status in stateMap) {
      this.show = stateMap[status];
    }
  }
}
