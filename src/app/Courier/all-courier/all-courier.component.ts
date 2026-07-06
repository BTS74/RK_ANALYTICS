import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Subscription, Observable } from 'rxjs';
import { GenericActionEnum } from 'src/app/Model/area';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';
export type Courier = {
  courierId?: string;
  courierProvider?: string;
  courierProviderDeleted?: boolean;
  trackingLink: string;
  createdOn?: Date;
  editedOn?: Date;
}

@Component({
  selector: 'app-all-courier',
  templateUrl: './all-courier.component.html',
  styleUrls: ['./all-courier.component.css']
})
export class AllCourierComponent implements OnInit, OnDestroy {

  public tableHeader: string[] = ["Courier Id", "Courier Name", "Tracking Link", "Created On"];
  public tableBodyHeader: string[] = ["courierId", "courierProvider", "trackingLink", "createdOn"];
  public pageDetails: number = 0;
  public modifiedCategoriesData: [] = [];
  private eventsSubscription: Subscription = new Subscription();
  @Input() events: Observable<void> = new Observable<void>();
  @Output() editProviderCAll = new EventEmitter();

  constructor(private JsonHttpService: JsonHttpService, private confirmationService: ConfirmationService) { }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  ngOnInit(): void {

    this.getAllCourierProviders();

    this.eventsSubscription = this.events.subscribe(() => this.getAllCourierProviders());
  }

  getAllCourierProviders() {
    this.JsonHttpService.FetchAllCourier(this.pageDetails).subscribe({
      next: (value: any) => {
        this.modifiedCategoriesData = value.data[0].content;
      }
    })
  }

  async action(selectedData: any) {
    switch (selectedData.action) {
      case GenericActionEnum.EDIT:
        // this.router.navigate(['/parcel-service/' + selectedData.data.locationId])
        this.editProviderCAll.emit(selectedData.data)
        break;

      case GenericActionEnum.DELETE:
        if (await this.confirm())
          this.deleteProvider(selectedData.data);
        break;

      default:
        break;
    }
  }

  deleteProvider(data: Courier) {
    let modified = { ...data, courierProviderDeleted: true }

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

}
