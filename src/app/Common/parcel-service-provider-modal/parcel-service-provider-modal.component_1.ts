import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { hubDetails } from 'src/app/Data/interface';

@Component({
  selector: 'app-parcel-service-provider-modal',
  templateUrl: './parcel-service-provider-modal.component.html',
  styleUrls: ['./parcel-service-provider-modal.component.css']
})
export class ParcelServiceProviderModalComponent implements OnInit {

  @Input() openModal: Observable<void> | undefined;
  @Input() parcelServiceProvider: string = ''
  @Input() uniqueDistricts: string[] = [];
  @Output() onChangeDistrictEmitter = new EventEmitter();
  @Output() onHubselectedConfirmation = new EventEmitter();
  @Output() onHubSelectedCheckBox = new EventEmitter();
  @Input () hubDetails: hubDetails[] = [];
  private openModalSubscription: Subscription | undefined;

  ngOnDestroy(): void {
    this.openModalSubscription?.unsubscribe()
  }

  ngOnInit(): void {

    this.openModalSubscription = this.openModal?.subscribe(() => this.openModalBox());
  }
  openModalBox(): void {
    document.getElementById('parcelHubList')?.click();
  }
  constructor() { }


}
