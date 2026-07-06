
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';
interface category {
  productSubCategoryDetails: [subCategory],
  totalNoOfProducts: number,
  productCategory: string
  categoryCreatedOn: Date,
  categoryUpdatedOn: Date
}

interface subCategory {
  productSubCategoryName: string,
  totalNoOfProducts: number,
  subCategoryCreatedOn: Date,
  subCategoryUpdatedOn: Date
}
@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.css']
})
export class AllCategoriesComponent implements OnInit {

  constructor(private jsonHttpService: JsonHttpService, private datePipe: DatePipe,private router:Router) { }

  categories: any;
  modifiedCategoriesData: any;
  public pageDetails: number = 0; 
  public tableHeader: any = ["Category Id", "Category", "SubCategory Count", "Created On", "Updated On"];
  public tableBodyHeader: any = ["categoryId", "productCategory", "productSubCategoryDetails", "categoryCreatedOn", "categoryUpdatedOn"];

  public tableCategoryHeader: any = ["SubCategory Id", "SubCategory", "SubCategory Count", "Created On", "Updated On"];
  public tableCategoryBodyHeader: any = ["subCategoryId", "productSubCategoryName", "totalNoOfProducts", "subCategoryCreatedOn", "subCategoryUpdatedOn"];

  @Output() openModal = new EventEmitter();
  eventsSubject: Subject<void> = new Subject<void>();
  selectedHeading:string='';

  ngOnInit(): void {
    this.getCategoryForHeadr(0)
  }

  dateTransform(dataToTransform: any) {
    return this.datePipe.transform(dataToTransform, 'yyyy MMM dd hh:mm a');
  }

  getCategoryForHeadr(pageNo: number) {
    this.jsonHttpService.FetchAllCategoriesWithPagination(pageNo).subscribe((value: any) => {
      this.pageDetails = value.totalElements;
      this.modifiedCategoriesData = value.content;
      this.sortData();
    })
  }

  deleteProduct(prodId: string) {

  }
  routeToUpdateProduct(prodId: string) {
  }


  refresh() {
    this.getCategoryForHeadr(0);
  }
  nextPage(data: any) {
    this.getCategoryForHeadr(data)
  }

  op(selectedData: any) {
    this.jsonHttpService.FetchAllCategories().subscribe((data: any) => {
      data.data[0].forEach((value: any) => {
        if (value.id == selectedData.id) {
          this.categories = value?.productSubCategoryDetails;
          this.selectedHeading = value.productCategory;
          value?.productSubCategoryDetails?.length && this.eventsSubject.next();
        }
      })
    })

 
  }

  sortData() {
    this.modifiedCategoriesData?.forEach((data: any) => {
      data.categoryId = data.categoryId ? '#' + data.categoryId : '-';
      data.productSubCategoryDetails = data.productSubCategoryDetails?.length ? data.productSubCategoryDetails?.length : '-';
      data.categoryCreatedOn = this.dateTransform(data.categoryCreatedOn);
      data.categoryUpdatedOn = this.dateTransform(data.categoryUpdatedOn);
    })
  }

  routeToCategory(){
    this.router.navigate(['/add-category']);
  }

}

