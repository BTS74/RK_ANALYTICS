import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.css']
})
export class GenericModalComponent implements OnInit, OnDestroy {
  @Input() tableHeader: any;
  @Input() tableBodyHeader: any;
  @Output() updateCAll = new EventEmitter();
  @Output() updatePageEmitter = new EventEmitter();
  @Input() productsList: any;
  @Input() pageDetails: any = {};
  @Input() heading:string = '';
  @Input() openModal: Observable<void> | undefined;
  private openModalSubscription: Subscription | undefined;
  categories: any;

  constructor() { }

  ngOnDestroy(): void {
    this.openModalSubscription?.unsubscribe()
  }

  ngOnInit(): void {
   
    this.openModalSubscription = this.openModal?.subscribe(() => this.openModalBox());
  }

  refresh() {

  }
  
  nextPage(data: any) {

  }

  openModalBox() {
    document.getElementById('generic-modal')?.click();
  }
}
