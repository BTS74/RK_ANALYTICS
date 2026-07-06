import { AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs'
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';
import { ConfirmationService, MenuItem, PrimeIcons } from 'primeng/api';
import { ModeOfDeliveryEnum, OrderStatusEnum, OrderStatusModel, OrderUpdateModel, PaymentStatusEnum } from 'src/app/Model/products';
import { PaymentDoneOnAnotherGatewayModel, PaymentRegenerateModel } from 'src/app/Model/orderFilter';
import { OrderModel } from 'src/app/Data/cart';
import { Courier } from 'src/app/Courier/all-courier/all-courier.component';
import { ChangeDetectorRef } from '@angular/core';
import { DDANDNGSPaymentTransactionModel } from 'src/app/Model/products copy';

@Component({
  selector: 'app-order-over-view-table',
  templateUrl: './order-over-view-table.component.html',
  styleUrls: ['./order-over-view-table.component.css']
})
export class OrderOverViewTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() orderList: undefined | any;
  @Input() pageDetails: any = {};
  @Input() events: Observable<void> | undefined;
  @Output() updateCAll = new EventEmitter();
  @Output() updatePageEmitter = new EventEmitter();
  @Input() modeOdDelivery: string | undefined;
  @Input() courierServiceList: Courier[] = [];
  @Output() updateCourierDetails = new EventEmitter();
  @Output() updateCourierAction = new EventEmitter();
  @Input() tHeader: string[] = []

  public triggerCommentDialogBox: Subject<void> = new Subject<void>();

  previewOrderList: Subject<void> = new Subject<void>();
  printOrderList: any = [];
  updateProductValue: any = {};
  updateOrderStatus: any = {};
  ModeOfDeliveryEnum = ModeOfDeliveryEnum;
  public currentPage: number = 0;
  public config = {
    itemsPerPage: 10,
    currentPage: 0,
    totalItems: 0
  };
  private eventsSubscription: Subscription | undefined;
  private actRoute_subscription: Subscription;
  form!: UntypedFormGroup;
  form2!: UntypedFormGroup;
  form3!: UntypedFormGroup;
  form4!: UntypedFormGroup;
  submitted: boolean[] = [false, false, false, false];
  updateComment: any = {};
  payment = {} as PaymentDoneOnAnotherGatewayModel;
  PaymentRegenerate = {} as PaymentRegenerateModel;

  visible: boolean[] = [false, false];
  ListDDANDNGSS: DDANDNGSPaymentTransactionModel[] = [];
  isPaymentDialogVisible: boolean = false;

  
  constructor(private formBuilder: FormBuilder,
    private jsonHttpService: JsonHttpService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private confirmationService: ConfirmationService) {

    this.actRoute_subscription = this.actRoute.queryParams.subscribe((params: any) => {
      this.config.currentPage = Number(params.page) + 1;
    })
  }


  ngOnInit(): void {

    this.eventsSubscription = this.events!.subscribe(() =>
      this.refreshPageConfigVAlues()
    )

    this.form = this.formBuilder.group({
      paymentStatus: [''],
      status: [''],
    });

    this.form2 = this.formBuilder.group({
      totalTransportationCost: ['', Validators.required],
      totalLiftingCost: [''],
      totalPackingCharge: [''],
      totalPackingCost: [''],
      totalLabourCost: []
    })
    this.form3 = this.formBuilder.group({
      comments: ['', Validators.required],
    })

    this.form4 = this.formBuilder.group({
      paymentGateway: ["", Validators.required],
      transactionId: ["", Validators.required],
      paymentOn: ["", Validators.required],
    });


  }

  ngOnDestroy(): void {
    this.actRoute_subscription.unsubscribe();
  }

  get transportCostCheck(): { [key: string]: AbstractControl } {
    return this.form2.controls;
  }

  get commentCheck(): { [key: string]: AbstractControl } {
    return this.form3.controls;
  }

  get payemntFormCheck(): { [key: string]: AbstractControl } {
    return this.form4.controls;
  }


  ngOnChanges() {
    this.config.totalItems = this.pageDetails
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

  // show delivery charge in HTML via innerHTML
  showDeliveryCharge(data: any) {
    switch (data.modeOfDelivery) {
      case "DoorDelivery":
      case "Parcel":
        return data.cartModel?.totalPackingCharge ?? 0;
      case "Courier":
        return data.cartModel?.totalDeliveryCharge ?? 0;

      default:
        return '-'
    }
  }

  refreshPageConfigVAlues() {

    this.config = {
      itemsPerPage: 10,
      currentPage: 0,
      totalItems: this.pageDetails
    };
  }


  previewOrderListOut(data: any) {
    this.printOrderList = data;
    setTimeout(() => { this.previewOrderList.next(); }, 100)
  }

  printBill(data: any): void {

    // this.jsonHttpService.sendPrintBillInfo(data);
    window.open(this.jsonHttpService.UiURL + "/print/" + data.orderId, "_blank");
    // window.open("http://localhost:50/print/"+data.orderId, "_blank");

  }

  editBill(data: any) {
    // if (data.modeOfDelivery == 'Courier'){
    //   return;
    // }

    this.router.navigate(['/order-update/' + data.orderId])
  }



  async updateTransportation(orderId: string, type: string) {
    this.submitted[1] = true;
    let selectedOrder;
    // let elementId = type == 'totalTransportationCost' ? 'totalTransportationCost' : 'totalLiftingCost';
    let elementId = type;
    let inputValue = (<HTMLInputElement>document.getElementById(orderId + elementId)).value;
    for (let index = 0; index < this.orderList.length; index++) {
      const element = this.orderList[index];
      if (element.orderId == orderId) {
        selectedOrder = element
        // if (element.totalTransportationCost == parseInt(inputValue))
        //   return;
      }

    }

    if (!inputValue.trim()) {
      return this.jsonHttpService.sendToastMessage('Enter Valid Amount', '', "failure")
    }


    this.updateOrderStatus = {};
    // if (type == 'totalTransportationCost') {
    //   this.updateOrderStatus["totalTransportationCost"] = inputValue;
    // } else if (type == 'totalLiftingCost') {
    //   this.updateOrderStatus["totalLiftingCost"] = inputValue;
    // } else 
    this.updateOrderStatus[type] = inputValue;
    if (type == "totalPackingCharge") {
      let packing = { totalPackingCharge: inputValue }
      this.updateOrderStatus["cartModel"] = packing;
      delete this.updateOrderStatus[type]
    }
    this.updateOrderStatus["orderId"] = orderId;

    if (await this.confirm(type)) {
      this.updateOrderBillStatusCAll(this.updateOrderStatus, orderId);
    } else {
      (<HTMLInputElement>document.getElementById(orderId + elementId)).value = selectedOrder[type];
    }
  }


  optionsChangeFromPEnding(data: any, value: any) {
    this.updateOrderStatus["status"] = OrderStatusEnum.dispatched;
    this.markdoorDeliveryOrderAsCancelled(this.updateOrderStatus, value.orderId);
    return;
  }

  optionsChange(data: any, value: any) {


    this.form.removeControl('comments');
    this.form.removeControl('parcelTrackingId');
    this.updateOrderStatus = {};

    /**
   * 
   * @param ModeOfDeliveryEnum.Courier - Courier related queries
   * 
   */
    switch (value.modeOfDelivery) {
      case ModeOfDeliveryEnum.Courier:
        this.courierOperations(data, value);
        break;
      case ModeOfDeliveryEnum.Parcel:
        this.parcelOperations(data, value);
        break;
      case ModeOfDeliveryEnum.DoorDelivery:
        this.doorDeliveryOperations(data, value);
        break;

      default:
        break;
    }
  }

  courierOperations(data: any, value: any) {
    if (value.orderStatusText == OrderStatusEnum.newOrder &&
      (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
      data.value == OrderStatusEnum.onHold) {
      this.updateOrderStatus["paymentStatus"] = value.paymentStatusText;
      this.form.addControl('comments', this.formBuilder.control({ value: '', disabled: false }, Validators.required));
      this.updateOrderStatus["modeOfDelivery"] = value.modeOfDelivery;
      this.updateOrderStatus["orderId"] = value.orderId;
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.onHold;
      this.changeOrderStatus(this.updateOrderStatus, value.orderId);
    }
    else if (value.orderStatusText == OrderStatusEnum.onHold &&
      (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
      data.value == OrderStatusEnum.dispatched) {
      this.updateOrderStatus["status"] = OrderStatusEnum.dispatched;
      this.updateOrderStatusCAll(this.updateOrderStatus, value.orderId);
    } else if (value.orderStatusText == OrderStatusEnum.dispatched &&
      (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
      data.value == OrderStatusEnum.onHold) {
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.onHold;
      this.changeOrderStatus(this.updateOrderStatus, value.orderId);
    } else if (value.orderStatusText == OrderStatusEnum.newOrder &&
      (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
      data.value == OrderStatusEnum.dispatched) {
      this.updateOrderStatus["status"] = OrderStatusEnum.dispatched;
      this.updateOrderStatusCAll(this.updateOrderStatus, value.orderId);
    }
    //  else if ((value.orderStatusText == OrderStatusEnum.newOrder || value.orderStatusText == OrderStatusEnum.onHold ) &&
    //   data.value == OrderStatusEnum.cancelled) {
    //   this.updateOrderStatus["status"] = OrderStatusEnum.cancelled;
    //   this.changeOrderStatus(this.updateOrderStatus, value.orderId);
    // } 
    else if (data.value == OrderStatusEnum.clear) {
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.clear;
      this.changeOrderStatus(this.updateOrderStatus, value.orderId);
    }
  }


  parcelOperations(data: any, value: any) {
    this.updateOrderStatus["paymentStatus"] = value.paymentStatusText;
    this.updateOrderStatus["modeOfDelivery"] = value.modeOfDelivery;
    this.updateOrderStatus["orderId"] = value.orderId;

    if (value.orderStatusText == OrderStatusEnum.newOrder &&
      (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
      data.value == OrderStatusEnum.onHold) {
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.onHold;
    }
    else if (value.orderStatusText == OrderStatusEnum.newOrder &&
      (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
      data.value == OrderStatusEnum.dispatched) {
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.dispatched;
      this.form.addControl('parcelTrackingId', this.formBuilder.control({ value: 1, disabled: false }, Validators.required));
      document.getElementById('staticBackdropTrigger')?.click();
      return;
    }

    else if (value.orderStatusText == OrderStatusEnum.newOrder &&
      (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
      data.value == OrderStatusEnum.cancelled) {
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.cancelledManually;

    }
    else if (value.orderStatusText == OrderStatusEnum.onHold &&
      (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
      data.value == OrderStatusEnum.dispatched) {
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.dispatched;

      this.form.addControl('parcelTrackingId', this.formBuilder.control({ value: 1, disabled: false }, Validators.required));
      if (value.parcelTrackingId)
        this.updateOrderStatus.parcelTrackingId
      document.getElementById('staticBackdropTrigger')?.click();
      return;
    } else if (value.orderStatusText == OrderStatusEnum.dispatched &&
      (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
      data.value == OrderStatusEnum.onHold) {
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.onHold;

    } else if (value.orderStatusText == OrderStatusEnum.newOrder &&
      value.paymentStatusText == PaymentStatusEnum.processing &&
      data.value == OrderStatusEnum.dispatched && value.cartModel.isPlantsOnly) {
      this.form.addControl('parcelTrackingId', this.formBuilder.control({ value: 1, disabled: false }, Validators.required));
      if (value.parcelTrackingId)
        this.updateOrderStatus.parcelTrackingId
      document.getElementById('staticBackdropTrigger')?.click();
      return;
    } else if (value.orderStatusText == OrderStatusEnum.newOrder &&
      value.paymentStatusText == PaymentStatusEnum.processing &&
      data.value == OrderStatusEnum.cancelled) {
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.cancelledManually;
    } else if (value.orderStatusText == OrderStatusEnum.cancelled &&
      (value.paymentStatusText == PaymentStatusEnum.failure) &&
      data.value == OrderStatusEnum.onHold) {
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.onHold;
    } else if (data.value == OrderStatusEnum.clear) {
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.clear;
    }
    this.changeOrderStatus(this.updateOrderStatus, value.orderId);
  }


  doorDeliveryOperations(data: any, value: any) {

    this.updateOrderStatus["paymentStatus"] = value.paymentStatusText;
    this.updateOrderStatus["modeOfDelivery"] = value.modeOfDelivery;
    this.updateOrderStatus["orderId"] = value.orderId;

    if (value.orderStatusText == OrderStatusEnum.newOrder &&
      (data.value == OrderStatusEnum.onHold) || (data == OrderStatusEnum.onHold)) {
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.onHold;
    } else if (value.orderStatusText == OrderStatusEnum.newOrder && data.value == OrderStatusEnum.cancelled) {
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.cancelledManually;
      this.updateOrderStatus["reasonForCancelling"] = "Cancelled Manuallly"
    } else if (value.orderStatusText == OrderStatusEnum.newOrder && data.value == OrderStatusEnum.dispatched) {
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.dispatched;
    } else if (value.orderStatusText == OrderStatusEnum.dispatched && data.value == OrderStatusEnum.onHold) {
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.onHold;
    } else if (value.orderStatusText == OrderStatusEnum.onHold && data.value == OrderStatusEnum.dispatched) {
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.dispatched;
    } else if (data.value == OrderStatusEnum.clear) {
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.clear;
    }
    this.changeOrderStatus(this.updateOrderStatus, value.orderId);
  }


  updateCommentsByConfirmDialog(data: any) {
    document.getElementById('commentStaticBackdropTrigger')?.click();
    this.updateOrderStatus = data;
    // this.triggerCommentDialogBox.next(data);
  }

  async makeComments(orderId: string) {
    this.submitted[2] = true;
    if (this.form.invalid) {
      return;
    }
    let updateOrderStatus: any = {};
    updateOrderStatus["reasonForCancelling"] = this.updateComment.comments;
    this.updateOrderStatus = await this.updateOrderBillStatusCAll(updateOrderStatus, orderId);
    this.submitted[2] = false;
    delete this.updateComment.comments;
  }

  makeProccessingPayAsDispatch() {

    this.submitted[0] = true;
    if (this.form.invalid) {
      return;
    }
    let orderId = this.updateOrderStatus["orderId"];

    this.updateOrderStatus["comments"] = "Order dispatched";
    delete this.updateOrderStatus["paymentStatus"];
    delete this.updateOrderStatus["orderId"];
    if (this.updateOrderStatus["orderStatus"] == OrderStatusEnum.dispatched) {
      this.updateOrderStatus["status"] = OrderStatusEnum.dispatched;
      this.updateOrderStatusCAll(this.updateOrderStatus, orderId);
    } else {
      this.updateOrderStatus["orderStatus"] = OrderStatusEnum.onHold;
      this.changeOrderStatus(this.updateOrderStatus, orderId);
    }

    document.getElementById('staticBackdropTrigger')?.click();
  }

  get orderStatusCheck(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get(availability: string, data: any) {
    this.updateProductValue["status"] = availability;
    this.updateProductValue["comments"] = "Order dispatched";
    this.updateOrderStatusCAll(this.updateProductValue, data);
  }

  confirm(type: string): Promise<boolean> {
    let updateOrderStatus: any = {};
    return new Promise(resolve => {
      this.confirmationService.confirm({
        message: "Are you sure that you want to proceed?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => {

          if (type == 'totalTransportationCost') {
            updateOrderStatus["totalTransportationCost"] = this.updateOrderStatus.totalTransportationCost;
          } else if (type == 'totalLiftingCost') {
            updateOrderStatus["totalLiftingCost"] = this.updateOrderStatus.totalTransportationCost;
          } else if (type == "totalPackingCharge") {
            let packing = { totalPackingCharge: this.updateOrderStatus.totalTransportationCost }
            updateOrderStatus["cartModel"] = packing;
          }
          resolve(true);
        },
        reject: () => {
          resolve(false);
        }
      })
    });
  }

  confirmOnHold(value: any) {
    let isOrderHold = value.orderStatus[value.orderStatus.length - 1].status == OrderStatusEnum.onHold;
    this.confirmationService.confirm({
      message: !isOrderHold ? 'Are you sure that you want to mark this order as Pending ?' : 'Are you sure to remove the pending status',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateOrderStatus["status"] = !isOrderHold ? OrderStatusEnum.onHold : OrderStatusEnum.inProgress;

        this.optionsChange(OrderStatusEnum.onHold, value);

      },
      reject: () => {
        (<HTMLInputElement>document.getElementById(value.orderId)).checked = false;
      },
    });
  }



  openProductList() {
    document.getElementById('prodList')?.click()
  }

  updateOrderStatusCAll(valueToUpdate: OrderStatusModel, orderId: string) {

    this.jsonHttpService.updateOrderStatus(valueToUpdate, orderId).subscribe({
      next: () => {
        this.updateOrderStatus = {};
        this.updateCAll.emit();
        this.jsonHttpService.sendToastMessage('Order ID  #' + orderId, 'Status Updated successfully', "success");
      }, error: (error) => {
        this.jsonHttpService.sendToastMessage(error.error.statusText, '', "failure");
        this.updateCAll.emit();
        // setTimeout(() => {
        //   this.openProductList()
        // }, 400)
      }
    })

  }

  updateOrderBillStatusCAll(valueToUpdate: any, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.jsonHttpService.updateBillStatus(valueToUpdate, data).subscribe({ //need to review due to emptyness updating the data
        next: (value: any) => {
          this.updateCAll.emit();
          this.jsonHttpService.sendToastMessage('Order ID  #' + data, 'Status Updated successfully', "success");
          resolve(value.data[0]);
        }, error: (error: any) => {
          this.jsonHttpService.sendToastMessage(error.error.statusText, '', "failure");
          this.updateCAll.emit();
          setTimeout(() => {
            this.openProductList()
          }, 400)
          reject(error);
        }
      })
    })
  }

  billPrintedChange(data: any, value: any) {
    this.updateOrderStatus = {};
    this.updateOrderStatus["billPrinted"] = true;
    this.updateOrderBillStatusCAll(this.updateOrderStatus, value.orderId);
  }

  callConnectedAndCompletion(data: any, attribute: string) {
    this.updateOrderStatus = {};
    this.updateOrderStatus[attribute] = !data[attribute];
    this.updateOrderBillStatusCAll(this.updateOrderStatus, data.orderId);
  }



  pageChangeEvent(event: any) {
    this.config['currentPage'] = event;
    this.updatePageEmitter.emit(event - 1);
    this.currentPage = event - 1;
  }

  refreshTable() {
    this.updateCAll.emit(this.currentPage);
  }

  markdoorDeliveryOrderAsCancelled(valueToUpdate: OrderUpdateModel | any, data: any) {

    valueToUpdate["reasonForCancelling"] = valueToUpdate["comments"];
    delete valueToUpdate['comments']
    this.changeOrderStatus(valueToUpdate, data);

  }

  changeOrderStatus(valueToUpdate: OrderUpdateModel, orderId: string) {

    this.jsonHttpService.updateOrderStatusAsDispatch(valueToUpdate, orderId).subscribe({
      next: () => {
        this.updateOrderStatus = {};
        this.updateCAll.emit();

        // if comment box is displayed it'll be hidden
        if (document.getElementById('commentsStaticBackdrop')?.style.display == 'block') {
          document.getElementById('commentStaticBackdropTrigger')?.click();
        }

        if (document.getElementById('staticBackdrop')?.style.display == 'block') {
          document.getElementById('staticBackdropTrigger')?.click();
        }

        this.updateComment = {};
        this.submitted = [false, false, false];

        this.jsonHttpService.sendToastMessage('Order ID  #' + orderId, 'Status Updated successfully', "success");
      },
      error: (error) => {
        this.jsonHttpService.sendToastMessage(error.error.statusText, '', "failure");
        this.updateCAll.emit();
      }

    })
  }

  toHideTbaleContent(theaderValue: string): boolean {
    return this.tHeader.includes(theaderValue);
    // switch (this.modeOdDelivery) {
    //   case "Parcel":
    //   case "Courier":
    //     return true;

    //   case "DoorDelivery":
    //     return false;

    //   default:
    //     return true
    // }
  }

  generatePaymnetUrl(orderId: string) {
    this.jsonHttpService.FetchRepaymentUrl(orderId).subscribe({
      next: (value) => {
        // console.log(value); 
      }, error: (err) => {

      }
    })
  }


  onItemClick(event: any, type: any) {
    this.PaymentRegenerate.orderId = event.orderId
    switch (type) {
      case "Regenerate Link":
        this.sendLinkToPay(event.orderId);
        break;
      case "Enter Details":
        this.visible = [true, false];
        break;
      case "View Details":
        this.viewRepaymentDetails(event.orderId);
        break;
      case "Enter DDANDNGS Details":
        this.getDDANDNGS(event.orderId);
        this.isPaymentDialogVisible = true;
        break;

    }
  }
  sendLinkToPay(orderId: string) {
    this.jsonHttpService.FetchRepaymentUrl(orderId).subscribe({
      next: () => {
        this.jsonHttpService.sendToastMessage('', 'Payment link sent successfully', "success");
      }, error: (error: any) => {
        this.jsonHttpService.sendToastMessage('', error.error.statusText, "failure");
      }
    })
  }

  viewRepaymentDetails(orderId: string) {
    this.jsonHttpService.FetchRepaymentDetails(orderId).subscribe({
      next: (data: any) => {
        this.PaymentRegenerate = data.data[0];
        if (this.PaymentRegenerate.paymentDoneOnAnotherGatewayModel)
          this.payment = this.PaymentRegenerate.paymentDoneOnAnotherGatewayModel;
        this.visible = [false, true];
      }, error: (error: any) => {
        this.jsonHttpService.sendToastMessage('', error.error.statusText, "failure");
      }
    })
  }



  async validPaymentForm() {
    this.submitted[3] = true;
    if (this.form4.invalid) {
      return;
    }
    this.PaymentRegenerate.paymentDoneOnAnotherGatewayModel = this.payment
    await this.updatePaymentStatus();
    this.resetForm();

  }
  resetForm() {
    this.submitted[3] = false;
    this.visible = [false, false];
    this.payment = {}
  }

  async updatePaymentStatus() {
    this.jsonHttpService.UpdatePaymentData(this.PaymentRegenerate).subscribe({
      next: () => {
        this.jsonHttpService.sendToastMessage('', 'Payment status updated successfully', "success");

      }, error: (error: any) => {
        this.jsonHttpService.sendToastMessage('', error.error.statusText, "failure");
      }, complete: () => {
        this.refreshTable();
      }
    })
  }

  optionsChangeForCourier(data: any, value: OrderModel) {
    this.updateCourierDetails.emit({ Action: 'optionsChange', data: data, value: value })
  }


  onInputChangeForCourier(event: any, value: OrderModel) {
    this.updateCourierDetails.emit({ Action: 'onInputChange', event: event, value: value })
  }

  getDDANDNGS(orderId: string) {

    this.jsonHttpService.getDDANDNGSpayment(orderId).subscribe({
      next: (data: any) => {
        this.ListDDANDNGSS = data.data[0];
      }
    })
  }

}
