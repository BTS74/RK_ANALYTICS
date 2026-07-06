import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';

export function getDeliveryTaxableIncome(totalDeliveryCharge: number, type: number) {
  let TaxableDeliveryCharge = Math.ceil(totalDeliveryCharge * (100.00 / 118.00));
  return ((TaxableDeliveryCharge * 0.18) / type);
}

@Component({
  selector: 'app-order-manager',
  templateUrl: './order-manager.component.html',
  styleUrls: ['./order-manager.component.css']
})
export class OrderManagerComponent implements OnInit {
  title: string | undefined;
  @Input() printList: undefined | any;
  @Output() updateCAll = new EventEmitter();
  @Input() PrintPageEvent: Observable<void> | undefined;
  public orderUpdates: any = {}
  imgSrc: String = '';
  constructor(private jsonHttpService: JsonHttpService, private router: Router) { }

  ngOnInit(): void {
    this.PrintPageEvent?.subscribe(() => this.openProductList());
    this.imgSrc = this.jsonHttpService.globalImgURL;
  }

  openProductList() {
    document.getElementById('prodList')?.click()
  }

  updateStatus(orderId: string) {
    this.orderUpdates["status"] = "dispatched";
    this.orderUpdates["comments"] = "Order dispatched";
    this.jsonHttpService.updateOrderStatus(this.orderUpdates, orderId).subscribe({
      next: (data: any) => {
        this.updateCAll.emit();

        setTimeout(() => {
          this.openProductList()
        }, 400)


        this.jsonHttpService.sendToastMessage('Order ID  #' + orderId, 'Status Updated successfully', "success");
      }, error: error => {
        this.jsonHttpService.sendToastMessage('There is an error', error.error.statusText, "failure");

      }
    })
  }

  printBill(data: any) {
    this.openProductList();
    this.jsonHttpService.sendPrintBillInfo(data);
    this.router.navigate(['/print'])
  }

}
