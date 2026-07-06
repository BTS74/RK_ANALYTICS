import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { AvailabilityEnum } from 'src/app/Data/cart';
import { GenericActionEnum, areaModel } from 'src/app/Model/area';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';

export interface AllProductsFilterModel {
  availability: AvailabilityEnum | null;
  searchText: string | number | null;
}

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.css']
})

export class AreaListComponent implements OnInit {

  public tableHeader: string[] = ["Area Id", "Area", "Pincode"];
  public tableBodyHeader: string[] = ["areaId", "area", "pinCode"];
  public pageDetails: number = 0;
  public searchArea = {} as AllProductsFilterModel;
  public modifiedCategoriesData: [] = [];

  constructor(private JsonHttpService: JsonHttpService,
    private router: Router,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.searchArea = {
      availability: null,
      searchText: null
    }
    this.getCategoryForHeadr(0)
  }

  getCategoryForHeadr(pageNo: number) {
    this.JsonHttpService.FetchAllArea(pageNo, this.searchArea).subscribe((value: any) => {
      this.pageDetails = value.data[0].totalElements;
      this.modifiedCategoriesData = value.data[0].content;
    })
  }

  search(value: string) {
    if (!value) {
      return;
    }

    this.searchArea.searchText = value;
    this.getCategoryForHeadr(0)
  }

  op(selectedData: any) {

  }

  routeToAdd() {
    this.router.navigate(['/area/add']);
  }

  async action(selectedData: any) {
    switch (selectedData.action) {
      case GenericActionEnum.EDIT:
        this.router.navigate(['/area/' + selectedData.data.areaId])
        break;

      case GenericActionEnum.DELETE:
        if (await this.confirm())
        this.deleteArea(selectedData.data);
        break;

      default:
        break;
    }
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


  deleteArea(data: areaModel) {
    this.JsonHttpService.deleteArea(data).subscribe({
      next: (data: any) => {
        this.JsonHttpService.sendToastMessage("", 'Area deleted successfully', "success");
        this.getCategoryForHeadr(0)
      }, error: error => {
        this.JsonHttpService.sendToastMessage(error.error, "Error ", "failure");
      }
    })
  }

  refresh() {
    this.getCategoryForHeadr(0);
  }

  nextPage(data: any) {
    this.getCategoryForHeadr(data)
  }
}
