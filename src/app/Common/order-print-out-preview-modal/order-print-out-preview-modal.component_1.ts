import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Observable, Subscription } from 'rxjs';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModeOfDeliveryEnum } from 'src/app/Model/products';
import { productDetails, ProductNewGardenDetailsModel } from 'src/app/Product/add-new-product/add-new-product.component';
import { getDeliveryTaxableIncome } from 'src/app/Order/order-manager/order-manager.component';
import { products } from 'src/app/Product/single-product/single-product.component';
export function isTamilNadu(value: string) {
  if (!value) {
    return false;
  }
  value = value.trim();
  value = (value as any).replaceAll(" ", '');
  value = value.toLowerCase();
  return value.includes("tamilnadu")
}

@Component({
  selector: 'app-order-print-out-preview-modal',
  templateUrl: './order-print-out-preview-modal.component.html',
  styleUrls: ['./order-print-out-preview-modal.component.css']
})

export class OrderPrintOutPreviewModalComponent implements OnInit {
  public printList: any = [];
  products: any[] = [];
  @Output() updateCAll = new EventEmitter();
  updateProductValue: any = [];
  @ViewChild('print') print!: ElementRef;
  // private subscriptions: Subscription;
  public orderId: string | any;

  cgst: number = 0;
  sgst: number = 0;

  groupedProducts: { [category: string]: any[] } = {};

  constructor(private jsonHttpService: JsonHttpService, private actRoute: ActivatedRoute,
    private router: Router,) {

    // this.subscriptions = this.jsonHttpService.tiggerPrintBill().subscribe((message: any) => {
    //   this.printList = message.message;
    //   alert(this.printList)

    // });
  }




  groupProductsByCategory() {
    this.groupedProducts = this.printList.cartModel.products.reduce((acc: any, product: any) => {
      if (!acc[product.productModel.productCategory]) {
        acc[product.productModel.productCategory] = [];
      }
      acc[product.productModel.productCategory].push(product);
      return acc;
    }, {});
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  ngOnInit(): void {

    // setTimeout(() => {
    //   if (this.printList.length == 0) {
    //     this.router.navigate(['/order-overview'])
    //   }
    // }, 200);

    this.orderId = this.actRoute.snapshot.params['orderId'];
    if (this.orderId != undefined && this.orderId != null) {
      this.getOrdersFromOrderId(this.orderId);
    } else {
      this.router.navigate(['/order-overview']);
    }


  }

  showDeliveryCharge(data: any) {
    switch (data.modeOfDelivery) {
      case "DoorDelivery":
        return '₹ ' + data?.totalTransportationCost + '.00';
      case "Parcel":
        return '₹ ' + data.cartModel.totalPackingCharge + '.00';
      case "Courier":
        return '₹ ' + data.cartModel.totalDeliveryCharge + '.00';

      default:
        return '-'
    }
  }


  getModeOfDelivery(data: any) {
    switch (data.modeOfDelivery) {
      case "DoorDelivery":
        return 'Delivery Charge';
      case "Parcel":
        return 'Packing Charge';
      case "Courier":
        return 'Courier Charge';
      default:
        return '';
    }
  }

  getOrdersFromOrderId(orderId: string) {
    this.jsonHttpService.FetchOrderByIdForUsers(orderId).subscribe({
      next: (data: any) => {
        this.printList = data.data[0];
        this.printList.gstCalculation.forEach((data: any) => {
          const half = data.productGST / 2;
          data.cgst = Math.floor(half * 100) / 100; // Truncate to 2 decimals
          data.sgst = parseFloat((data.productGST - data.cgst).toFixed(2)); // Adjust to match total
        });

        this.groupProductsByCategory();
        if (this.printList !== null) {
          setTimeout(() => {
            this.printPage();
          }, 500);
        }

      }, error: error => {
      }
    })
  }

  calculateGSTSplit(totalGST: number): { cgst: number, sgst: number } {
    const half = totalGST / 2;
    const cgst = Math.floor(half * 100) / 100;
    const sgst = parseFloat((totalGST - cgst).toFixed(2));
    return { cgst, sgst };
  }



  printPage() {
    // let DATA: any = document.getElementById('print');
    // setTimeout(() => {
    //   html2canvas(DATA).then((canvas) => {
    //     let fileWidth = 208;
    //     let fileHeight = (canvas.height * fileWidth) / canvas.width;
    //     const FILEURI = canvas.toDataURL('image/png');
    //     let PDF = new jsPDF('p', 'mm', 'a4');
    //     let position = 0;
    //     PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
    //     PDF.save(this.printList.orderId + '.pdf');
    //   });   

    // }, 200);
    // this.jsonHttpService.sendToastMessage('Order ID   #' + this.printList.orderId, 'Downloaded successfully', "success");

  }

  modeOfDel(data: string) {
    switch (data) {
      case "DoorDelivery":
        return ModeOfDeliveryEnum.DoorDelivery;
      case "Parcel":
        return ModeOfDeliveryEnum.Parcel;
      case "Courier":
        return ModeOfDeliveryEnum.Courier;

      default:
        return '-'
    }
  }

  findSingleUnitPrice(data: ProductNewGardenDetailsModel) {
    const garden = data.productModel.productSetupDetails.find((value: ProductNewGardenDetailsModel) => value.growBagName == data.growBagName
      && value.potName == data.potName);
    return garden
  }

  getDeliveryTaxableIncome(totalDeliveryCharge: number, type: number) {
    return getDeliveryTaxableIncome(totalDeliveryCharge, type);
  }

  isTamilNadu(value: string) {
    return isTamilNadu(value);
  }
}
