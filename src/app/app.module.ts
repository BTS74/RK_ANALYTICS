import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderComponent } from './Common/header/header.component';
import { SidebarComponent } from './Common/sidebar/sidebar.component';

import { TableComponent } from './Common/table/table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FileUploadModule } from 'ng2-file-upload';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageLoaderComponent } from './Common/page-loader/page-loader.component';
import { LoaderService } from './services/Loader-Service/loader.service';
import { LoaderInterceptorService } from './services/Loader-Service/loader-interceptor.service';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { OrderOverViewComponent } from './Order/order-over-view/order-over-view.component';
import { OrderManagerComponent } from './Order/order-manager/order-manager.component';
import { OrderOverViewTableComponent } from './Order/order-over-view-table/order-over-view-table.component';
import { OrderManagerBoxesComponent } from './Order/order-manager-boxes/order-manager-boxes.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaymentsComponent } from './Payments/payments/payments.component';
import { AuthGuardService } from './services/Auth-Service/auth-guard.service';
import { HttpInterceptorService as TokenInterceptor } from './services/Token_Interceptor-service/http-interceptor.service';
import { NgxEncryptCookieService } from 'ngx-encrypt-cookie';

import { DatePipe } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TimelineModule } from 'primeng/timeline';
import { DragDropModule } from 'primeng/dragdrop';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { CartService } from './services/cart-service/cart.service';
import { HeadingComponent } from './Common/heading/heading.component';
import { OrderCourierManagerComponent } from './Order/order-courier-manager/order-courier-manager.component';
import { AllCourierComponent } from './Courier/all-courier/all-courier.component';
import { UtcDatePipe } from './services/DateService/utc-date.pipe';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { OrderListModule } from 'primeng/orderlist';
import { ChartModule } from 'primeng/chart';
import { ChartComponent } from './chart/chart/chart.component';
import { ManualPaymentsComponent } from './Payments/manual-payments/manual-payments.component';
import { ToastComponent } from './Common/toast/toast.component';
import { SearchBoxComponent } from './Common/search-box/search-box.component';
import { GenericTableComponent } from './Common/generic-table/generic-table.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    OrderManagerComponent,
    OrderOverViewTableComponent,
    OrderCourierManagerComponent,
    AllCourierComponent,
    UtcDatePipe,
    HeadingComponent,
    ChartComponent,
    ManualPaymentsComponent,
    PageLoaderComponent,
    HomeComponent,
    OrderOverViewComponent,
    OrderManagerBoxesComponent,
    PaymentsComponent,
    HeaderComponent,
    SidebarComponent,
    LoginComponent, ToastComponent, SearchBoxComponent, GenericTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ImageCropperModule,
    FileUploadModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ConfirmDialogModule,
    ToastModule,
    TimelineModule,
    DragDropModule,
    TabViewModule,
    DropdownModule, OrderListModule, ChartModule,
    SidebarModule, MenuModule, ButtonModule, DialogModule
  ],
  providers: [LoaderService, NgxEncryptCookieService, DatePipe, ConfirmationService, CartService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
