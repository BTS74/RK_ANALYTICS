import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManualPaymentsComponent } from './Payments/manual-payments/manual-payments.component';
import { OrderManagerBoxesComponent } from './Order/order-manager-boxes/order-manager-boxes.component';
import { AuthGuardService as AuthGuard } from './services/Auth-Service/auth-guard.service';
import { HomeComponent } from './home/home.component';
import { OrderOverViewComponent } from './Order/order-over-view/order-over-view.component';
import { PaymentsComponent } from './Payments/payments/payments.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  // { path: 'add-products', component: AddNewProductComponent, canActivate: [AuthGuard] },
  // { path: 'update-product/:prodId', component: AddNewProductComponent, canActivate: [AuthGuard] },
  // { path: 'login', component: LoginComponent },
  // { path: 'all-categories', component: AllCategoriesComponent, canActivate: [AuthGuard] },
  // { path: 'add-category', component: AddCategoryComponent, canActivate: [AuthGuard] },
  // { path: 'update-category', component: AddCategoryComponent, canActivate: [AuthGuard] },
  // { path: 'add-subcategory', component: AddCategoryComponent, canActivate: [AuthGuard] },
  // { path: 'add-subdivision', component: AddCategoryComponent, canActivate: [AuthGuard] },
  // { path: 'completed', component: RefundComponent, canActivate: [AuthGuard] },
  // { path: 'print/:orderId', component: OrderPrintOutPreviewModalComponent, canActivate: [AuthGuard] },
  // { path: 'payments', component: PaymentsComponent, canActivate: [AuthGuard] },
  // { path: 'order-preview-unconfirm/:modeOdDelivery', component: OrderUnconfirmedComponent, canActivate: [AuthGuard] },
  // { path: 'order-overview', component: OrderOverViewComponent, canActivate: [AuthGuard] },
  // { path: 'manual/processing', component: OrderOverViewComponent, canActivate: [AuthGuard] },
  // { path: 'order/:orderType/:modeOdDelivery', component: OrderOverViewComponent, canActivate: [AuthGuard] },
  // { path: 'order-type/:order_type', component: OrderOverViewComponent, canActivate: [AuthGuard] },
  // { path: 'product-overview', component: AllProductViewComponent, canActivate: [AuthGuard] },
  // { path: 'order-update/:orderId', component: OrderUpdateComponent, canActivate: [AuthGuard] },
  // { path: 'carousel/:type', component: HomeCarouselComponent, canActivate: [AuthGuard] },
  // { path: 'area', component: AreaListComponent, canActivate: [AuthGuard] },
  // { path: 'pp/charge', component: PostalChargeComponent },
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'area/add', component: AddAreaComponent, canActivate: [AuthGuard] },
  // { path: 'area/:areaId', component: AddAreaComponent, canActivate: [AuthGuard] },
  // { path: 'parcel-service/:locationId', component: AddParcelServiceComponent, canActivate: [AuthGuard] },
  // { path: 'all-parcel-service', component: AllParcelServiceListComponent },
  // { path: 'add-parcel-service', component: AddParcelServiceComponent, canActivate: [AuthGuard] },
  // { path: 'add-parcel-provider', component: AddParcelServiceComponent, canActivate: [AuthGuard] },
  // { path: 'add-courier', component: AddCourierComponent, canActivate: [AuthGuard] },
  // { path: 'edit-courier', component: AddCourierComponent, canActivate: [AuthGuard] },
  // { path: 'order-update-courier', component: OrderCourierManagerComponent, canActivate: [AuthGuard] },
  // { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  // { path: 'cart/new-garden-setup', component: CartComponent, canActivate: [AuthGuard] },
  // { path: 'check-out', component: CheckOutComponent, canActivate: [AuthGuard] },
  // { path: 'check-out/new-garden-setup', component: CheckOutComponent, canActivate: [AuthGuard] },
  // { path: 'check-out/garden-setup', component: CheckOutComponent, canActivate: [AuthGuard] },
  // { path: 'category/:categoryType', component: ProductCategoriesComponent },
  // { path: 'route-category', component: ProductCategoriesComponent },
  // { path: 'category/:categoryType/:subCaegoryType', component: ProductCategoriesComponent },
  // { path: 'plants-summary', component: PaymentsComponent, canActivate: [AuthGuard] },


  { path: 'manual-payments', component: ManualPaymentsComponent, canActivate: [AuthGuard] },
  { path: 'invoice-manager', component: OrderManagerBoxesComponent, canActivate: [AuthGuard] },
  { path: 'charges', component: PaymentsComponent, canActivate: [AuthGuard] },
  { path: 'order', component: OrderOverViewComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
