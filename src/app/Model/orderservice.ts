// if (value.modeOfDelivery == ModeOfDeliveryEnum.Courier) {
//     // when its new order and need to mark it as hold
//     if (value.orderStatusText == OrderStatusEnum.newOrder &&
//       (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
//       data.value == OrderStatusEnum.onHold) {
//       this.updateOrderStatus["paymentStatus"] = value.paymentStatusText;
//       this.form.addControl('comments', this.formBuilder.control({ value: '', disabled: false }, Validators.required));
//       this.updateOrderStatus["modeOfDelivery"] = value.modeOfDelivery;
//       this.updateOrderStatus["orderId"] = value.orderId;
//       this.updateOrderStatus["orderStatus"] = OrderStatusEnum.onHold;
//       this.changeOrderStatus(this.updateOrderStatus, value.orderId);
//     }
//     else if (value.orderStatusText == OrderStatusEnum.onHold &&
//       (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
//       data.value == OrderStatusEnum.dispatched) {
//       this.updateOrderStatus["status"] = OrderStatusEnum.dispatched;
//       this.updateOrderStatusCAll(this.updateOrderStatus, value.orderId);
//     }
//     else if (value.orderStatusText == OrderStatusEnum.dispatched &&
//       (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
//       data.value == OrderStatusEnum.onHold) {
//       this.updateOrderStatus["orderStatus"] = OrderStatusEnum.onHold;
//       this.changeOrderStatus(this.updateOrderStatus, value.orderId);
//     }
//     else if (value.orderStatusText == OrderStatusEnum.newOrder &&
//       (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
//       data.value == OrderStatusEnum.dispatched) {
//       this.updateOrderStatus["status"] = OrderStatusEnum.dispatched;
//       this.updateOrderStatusCAll(this.updateOrderStatus, value.orderId);
//     }
//     return
//   } else if (value.modeOfDelivery == ModeOfDeliveryEnum.DoorDelivery) {
//     this.updateOrderStatus["paymentStatus"] = value.paymentStatusText;
//     // this.form.addControl('comments', this.formBuilder.control({ value: '', disabled: false }, Validators.required));
//     this.updateOrderStatus["modeOfDelivery"] = value.modeOfDelivery;
//     this.updateOrderStatus["orderId"] = value.orderId;

//     if (value.orderStatusText == OrderStatusEnum.newOrder &&
//       (data.value == OrderStatusEnum.onHold) || (data == OrderStatusEnum.onHold)) {
//       this.updateOrderStatus["orderStatus"] = OrderStatusEnum.onHold;
//     } else if (value.orderStatusText == OrderStatusEnum.newOrder && data.value == OrderStatusEnum.cancelled) {
//       this.updateOrderStatus["orderStatus"] = OrderStatusEnum.cancelledManually;
//       this.updateOrderStatus["reasonForCancelling"] = "Cancelled Manuallly"
//     } else if (value.orderStatusText == OrderStatusEnum.newOrder && data.value == OrderStatusEnum.dispatched) {
//       this.updateOrderStatus["orderStatus"] = OrderStatusEnum.dispatched;
//     } else if (value.orderStatusText == OrderStatusEnum.dispatched && data.value == OrderStatusEnum.onHold) {
//       this.updateOrderStatus["orderStatus"] = OrderStatusEnum.onHold;
//     } else if (value.orderStatusText == OrderStatusEnum.onHold && data.value == OrderStatusEnum.dispatched) {
//       this.updateOrderStatus["orderStatus"] = OrderStatusEnum.dispatched;
//     }

//     // document.getElementById('staticBackdropTrigger')?.click();
//     // this.form.addControl('comments', this.formBuilder.control({ value: '', disabled: false }, Validators.required));
//     this.changeOrderStatus(this.updateOrderStatus, value.orderId);
//     return;
//   }

//   else if (value.modeOfDelivery == ModeOfDeliveryEnum.Parcel) {

//     this.updateOrderStatus["paymentStatus"] = value.paymentStatusText;
//     this.updateOrderStatus["modeOfDelivery"] = value.modeOfDelivery;
//     this.updateOrderStatus["orderId"] = value.orderId;

//     if (value.orderStatusText == OrderStatusEnum.newOrder &&
//       (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
//       data.value == OrderStatusEnum.onHold) {
//       this.updateOrderStatus["orderStatus"] = OrderStatusEnum.onHold;
//       // this.form.addControl('comments', this.formBuilder.control({ value: '', disabled: false }, Validators.required));
//     }
//     else if (value.orderStatusText == OrderStatusEnum.newOrder &&
//       (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
//       data.value == OrderStatusEnum.dispatched) {
//       this.updateOrderStatus["orderStatus"] = OrderStatusEnum.dispatched;
//       this.form.addControl('parcelTrackingId', this.formBuilder.control({ value: 1, disabled: false }, Validators.required));
//       document.getElementById('staticBackdropTrigger')?.click();
//       return;
//     }

//     else if (value.orderStatusText == OrderStatusEnum.newOrder &&
//       (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
//       data.value == OrderStatusEnum.cancelled) {
//       this.updateOrderStatus["orderStatus"] = OrderStatusEnum.cancelledManually;
//       // this.form.addControl('comments', this.formBuilder.control({ value: '', disabled: false }, Validators.required));
//     }
//     else if (value.orderStatusText == OrderStatusEnum.onHold &&
//       (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
//       data.value == OrderStatusEnum.dispatched) {
//       this.updateOrderStatus["orderStatus"] = OrderStatusEnum.dispatched;
//       // this.form.addControl('comments', this.formBuilder.control({ value: '', disabled: false }, Validators.required));
//       this.form.addControl('parcelTrackingId', this.formBuilder.control({ value: 1, disabled: false }, Validators.required));
//       if (value.parcelTrackingId)
//         this.updateOrderStatus.parcelTrackingId
//       document.getElementById('staticBackdropTrigger')?.click();
//       return;
//     }
//     else if (value.orderStatusText == OrderStatusEnum.dispatched &&
//       (value.paymentStatusText == PaymentStatusEnum.captured || value.paymentStatusText == PaymentStatusEnum.COMPLETED) &&
//       data.value == OrderStatusEnum.onHold) {
//       this.updateOrderStatus["orderStatus"] = OrderStatusEnum.onHold;
//       // this.form.addControl('comments', this.formBuilder.control({ value: '', disabled: false }, Validators.required));
//     } else if (value.orderStatusText == OrderStatusEnum.newOrder &&
//       value.paymentStatusText == PaymentStatusEnum.processing &&
//       data.value == OrderStatusEnum.dispatched && value.cartModel.isPlantsOnly) {
//       this.form.addControl('parcelTrackingId', this.formBuilder.control({ value: 1, disabled: false }, Validators.required));
//       if (value.parcelTrackingId)
//         this.updateOrderStatus.parcelTrackingId
//       document.getElementById('staticBackdropTrigger')?.click();
//       return;
//     } else if (value.orderStatusText == OrderStatusEnum.newOrder &&
//       value.paymentStatusText == PaymentStatusEnum.processing &&
//       data.value == OrderStatusEnum.cancelled) {
//       this.updateOrderStatus["orderStatus"] = OrderStatusEnum.cancelledManually;
//     }
//     else if (value.orderStatusText == OrderStatusEnum.cancelled &&
//       (value.paymentStatusText == PaymentStatusEnum.failure) &&
//       data.value == OrderStatusEnum.onHold) {
//       this.updateOrderStatus["orderStatus"] = OrderStatusEnum.onHold;       
//     }
//     this.changeOrderStatus(this.updateOrderStatus, value.orderId);
//     return;
//   }