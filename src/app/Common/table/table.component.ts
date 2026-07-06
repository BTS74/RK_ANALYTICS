import { Component, EventEmitter, Input, OnChanges, OnInit, Output, OnDestroy } from '@angular/core';
import { products, SortAndGroup } from '../../Model/products';
import { JsonHttpService } from '../../services/Json-Http/json-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() productsList: products | undefined | any;
  @Output() updateCAll = new EventEmitter();
  @Input() pageDetails: any = {};
  @Output() updatePageEmitter = new EventEmitter();
  @Input() events: Observable<void> | undefined;
  @Input() tHeader: string[] = [];
  @Input() showPagination: boolean = true;
  private eventsSubscription: Subscription | undefined;
  updateProductValue: any = [];
  updateSortAndGroupValue = {} as SortAndGroup;
  totalPageNo: number = 0;
  public page: number = 0;
  public total: any;
  public currentPage: number = 0;
  form2!: UntypedFormGroup;
  public config = {
    itemsPerPage: 10,
    currentPage: 0,
    totalItems: 0
  };
  constructor(private JsonHttpService: JsonHttpService, private formBuilder: FormBuilder,
    private Router: Router, private confirmationService: ConfirmationService, private actRoute: ActivatedRoute) {
    this.actRoute.queryParams.subscribe((params: any) => {
      this.config.currentPage = Number(params.page) + 1;
    })
  }
  ngOnDestroy(): void {
    this.eventsSubscription?.unsubscribe();
  }

  ngOnInit(): void {

    // this.eventsSubscription = this.events!.subscribe(() =>
    //   this.refreshPageConfigVAlues()
    // )

    this.form2 = this.formBuilder.group({})

  }


  ngOnChanges() {
    this.config.totalItems = this.pageDetails
  }

  refreshPageConfigVAlues() {
    this.config = {
      itemsPerPage: 10,
      currentPage: 0,
      totalItems: this.pageDetails
    };
  }


  optionsChange(data: any) {
    this.updateProductValue = this.productsList[data.value];
    if (this.productsList[data.value]?.productDetails[0].availability == 'IN_STOCK') {
      this.get('OUT_OF_STOCK')
    } else {
      this.get('IN_STOCK')
    }
  }

  get(availability: string) {
    this.updateProductValue.productDetails.forEach((value2: any) => {
      value2.availability = availability;
    })
    this.confirm(this.updateProductValue)

  }

  confirm(data: products) {

    this.confirmationService.confirm({
      message: 'Are you sure that you want to update product Information(s)?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.UpdateProductStatus(data)
      },
      reject: () => {
        this.updateCAll.emit()
      },
    });
  }

  UpdateProductStatus(update: any) {
    this.JsonHttpService.updateProductStatus(update).subscribe({
      next: (data: any) => {
        this.updateCAll.emit();
        this.JsonHttpService.sendToastMessage(this.updateProductValue.productNameInEnglish, 'Product Status Updated', "success");
      }, error: error => {
        this.JsonHttpService.sendToastMessage(error.message, "Status failed to update ", "failure");
      }
    })
  }

  deleteProduct(prodId: string) {
    this.JsonHttpService.deleteProductByID(prodId).subscribe((data: any) => {
      this.updateCAll.emit();
    })

  }

  routeToUpdateProduct(prodId: string) {
    this.Router.navigate(['/update-product/' + prodId]);
  }

  // pageChangeEvent(event:any){
  //   this.page= event;
  //   this.updatePageEmitter.emit(this.page-1); 
  //   // this.getAllProducts(0,this.prodAvailabiility);
  //   }

  pageChangeEvent(event: any) {
    this.config['currentPage'] = event;
    this.updatePageEmitter.emit(event - 1);
    this.currentPage = event - 1;
  }

  refreshTable() {
    this.updateCAll.emit(this.currentPage);
  }


  updateSortAndGroup(data: products): void {
    this.confirm(data);
    // const prGpValue = parseInt((<HTMLInputElement>document.getElementById(data.productId)).value);

    // // Update the common fields
    // this.updateSortAndGroupValue = {
    //   ...this.updateSortAndGroupValue, // Retain existing values if necessary
    //   productId: data.productId,
    //   productNameInEnglish: data.productNameInEnglish,
    //   [type]: prGpValue, // Dynamically set the field based on `type`
    // };
    // console.log(this.updateSortAndGroupValue);
  }

  toHideTableContent(theaderValue: string): boolean {
    return this.tHeader.includes(theaderValue);
  }


}
