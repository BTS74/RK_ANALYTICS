import { Component, OnInit } from '@angular/core';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { filter as filterModel } from '../../Model/orderFilter';
import { DatePipe } from '@angular/common';
import { error } from 'console';
import { HttpResponse } from '@angular/common/http';
import { AnalyticsFilterModel, SalesDataResponse } from '../../Model/analytics';

export interface plantsFiltre {
  fromDate: string;
  toDate: string;
}
export interface PlantSummaryDTO {
  plantName: string;
  totalQuantity: number;
  price: number
}

export interface PlantSummaryResponseDTO {
  parcelPlants: PlantSummaryDTO[];
  doorDeliveryPlants: PlantSummaryDTO[];
}


@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  public allPayments: any = [];
  public form1!: FormGroup;
  public submitted = false;
  public page: number = 0;
  public total: any;

  public filtre: filterModel = {
    orderDate: null,
    paymentStatus: null
  };

  public analyticsFilter = {} as AnalyticsFilterModel;
  public tableHeader: string[] = ["Name", "Quantity"];
  public tableBodyHeader: string[] = ["plantName", "totalQuantity"];
  parcelPlants: PlantSummaryDTO[] = [];
  doorDeliveryPlants: PlantSummaryDTO[] = [];

  salesData = {} as SalesDataResponse;


  public paymentStatusFilter = ['FAILED', 'COMPLETED', 'ALL'];

  public pageConfig = {
    itemsPerPage: 0,
    currentPage: 1,
    totalItems: 0
  };



  constructor(private jsonHttpService: JsonHttpService, private formBuilder: FormBuilder, private datePipe: DatePipe) {
  }

  ngOnInit(): void {

    this.form1 = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });


    this.getPlantsSummary();

  }

  get checkPlantsFilter(): { [key: string]: AbstractControl } {
    return this.form1.controls;
  }

  getPlantsSummary() {
    this.submitted = true;
    if (this.form1.invalid) {
      return;
    }

    this.analyticsFilter.startDate = `${this.analyticsFilter.startDate}T00:00:00`;
    this.analyticsFilter.endDate = `${this.analyticsFilter.endDate}T23:59:59`;
    //     this.analyticsFilter.startDate = '2026-07-11T00:00:00.000Z';
    // this.analyticsFilter.endDate = '2026-07-11T23:59:59.000Z';

    this.jsonHttpService.FetchDashBoardSalesCharges(this.analyticsFilter).subscribe({
      next: (data: any) => {
        this.salesData = data;
      }, error: () => { this.salesData = {} as SalesDataResponse; }
    });
  }

}
