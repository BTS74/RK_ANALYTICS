import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { GenericActionEnum } from 'src/app/Model/area';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent implements OnInit, OnChanges {
  @Input() tableHeader: any;
  @Input() tableBodyHeader: any;
  @Output() updateCAll = new EventEmitter();
  @Output() openModal = new EventEmitter();
  @Output() actionEmitter = new EventEmitter();
  @Output() updatePageEmitter = new EventEmitter();
  @Input() productsList: any;
  @Input() actionsRequired: boolean = true;
  @Input() showPagination: boolean = true;
  @Input() pageDetails: any = {};
  @Input() getRowColor?: (rowData: any) => string; // Optional function to determine row color
  totalPageNo: number = 0;
  public page: number = 0;
  public total: any;

  @Input() public config = {
    itemsPerPage: 10,
    currentPage: 0,
    totalItems: 0
  };

  public currentPage: number = 0;

  GenericActionEnum = GenericActionEnum

  ngOnChanges() {
    // this.total = this.pageDetails;
    this.config.totalItems = this.pageDetails
  }


  constructor(private actRoute: ActivatedRoute) {
    this.actRoute.queryParams.subscribe((params: any) => {
      this.config.currentPage = Number(params.page) + 1;
    })
  }

  ngOnInit(): void {
  }

  deleteProduct(prodId: string) {
    this.updateCAll.emit();
  }

  routeToUpdateProduct(prodId: any) {
    this.openModal.emit(prodId)
  }

  action(action: GenericActionEnum, data: any) {
    this.actionEmitter.emit({ action: action, data: data });
  }

  // pageChangeEvent(event: any) {
  //   this.page = event;
  //   this.updatePageEmitter.emit(this.page - 1);
  // }


  pageChangeEvent(event: any) {
    this.config['currentPage'] = event;
    this.currentPage = event - 1;
    this.updatePageEmitter.emit(event - 1);

  }

  refreshTable() {
    this.updateCAll.emit(this.currentPage);
  }

}
