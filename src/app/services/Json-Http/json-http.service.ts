import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { OrderModel } from 'src/app/Data/cart';
import { areaModel } from 'src/app/Model/area';
import {  filter, filterValues, parcelModel, ParcelProviders, PaymentRegenerateModel, productfilterValues } from 'src/app/Model/orderFilter';
import { AnalyticsFilterModel, SalesData } from '../../Model/analytics';

interface carouselModel {
  homeCarouselImageUrl: String,
  homeCarouselRedirectUrl: String
}

@Injectable({
  providedIn: 'root'
})
export class JsonHttpService {

  private subject = new Subject<any>();
  private printBillEvent = new Subject<any>();
  private searchEvent = new Subject<any>();
  //Auth credentials
  public username = "Rk_PatTarAi";
  public password = "Rk_PatTarAi_GardenS_009_2023_03_022_0000407";

  sideBarCollapse: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public get hostUrl() {
    return this.host;
  }

  public UiURL = "https://admin.rkpattarai.com"
  public static websiteLink: string = "http://rkpattarai.com/";
  // public UiURL = "http://localhost:50"

  private host: string = "http://localhost:8080";
  // public host = "https://api.2.rkpattarai.com/rkpattarai-analytics-5.1.4-SNAPSHOT"

  // public host = "https://api.2.rkpattarai.com/rkpattarai-5.1.2-SNAPSHOT"
  // public host = "https://api.rkpattarai.com/rkpattarai-0.0.3-SNAPSHOT"


  get globalImgURL(): string {
    return JsonHttpService.imageURL
  }

  public static imageURL: string = "https://resource.rkpattarai.com/assets/images/uploads/";


  constructor(private http: HttpClient) { }

  openSideBarMenu() {
    this.sideBarCollapse.next(true);
  }

  FetchAllProducts(pageNo: number, data: any) {
    return this.http.post(this.host + "/product/get/page/all?page=" + pageNo, data);
  }

  updateProductStatus(data: any) {
    return this.http.put(this.host + "/product/update", data);
  }

  deleteProductByID(prodID: string) {
    return this.http.delete(this.host + "/product/delete/" + prodID);
  }

  uploadProduct(data: any) {
    return this.http.post(this.host + "/product/create", data);
  }

  FetchProductById(prodId: string) {
    return this.http.get(this.host + "/product/get/" + prodId); //caching done
  }

  /** toast**/
  triggerToastMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  sendToastMessage(message: string, title: any, type: any) {
    this.subject.next({ message: message, title: title, type: type });
  }
  /****/

  /** printBill**/

  tiggerPrintBill(): Observable<any> {
    return this.printBillEvent.asObservable();
  }

  sendPrintBillInfo(data: any) {
    setTimeout(() => {
      this.printBillEvent.next({ message: data });
    }, 50);
  }
  /****/

  /** search Emitter**/
  triggerSearchValue(): Observable<any> {
    return this.searchEvent.asObservable();
  }

  sendSearchValue(message: string) {
    this.searchEvent.next({ message: message });
  }
  /****/


  FetchAllOrder() {
    return this.http.get(this.host + "/order/get/all");
  }

  FetchAllOrderWithFilters(pageNo: number, data: any) {
    return this.http.post(this.host + "/order/get/page/all?page=" + pageNo, data);
  }
  FetchAllOrderWithFilter(pageNo: number, data: any, sortField: string = 'orderId', sortDirection: 'asc' | 'desc' = 'desc') {
    const url = `${this.host}/order/get/page/all?page=${pageNo}&sort=${sortField},${sortDirection}`;
    return this.http.post(url, data);
  }

  FetchAllOrderAnalyticsWithFilters(pageNo: number, data: any, paymentType: string) {
    return this.http.post(this.host + "/order/get/all/analytics/" + paymentType + "?page=" + pageNo, data);
  }

  updateOrderStatus(data: any, orderId: string) {
    return this.http.put(this.host + "/order/update/status/" + orderId, data);
  }

  FetchOrderById(orderId: string) {
    return this.http.get(this.host + "/order/get/" + orderId);
  }

  FetchProductsCount() {
    return this.http.get(this.host + "/product/get/over/all/status");
  }


  FetchAllPaymentsWithFilters(pageNo: number, data: any) {
    return this.http.post(this.host + "/payment/get/page/all?page=" + pageNo, data);
  }

  FetchOrderStats(data: any) {
    return this.http.get(this.host + "/order/get/over/all/status" + data);
  }

  FetchOrderStatsBydate(data: filter) {
    return this.http.post(this.host + "/order/get/over/all/status", data);
  }

  FetchOrderStatsStream() {
    return this.http.get(this.host + "/order/stream/");
  }

  fetchOrderByPhoneNumber(data: any, pageNo: number,) {
    return this.http.post(this.host + "/order/get/user/all?page=" + pageNo, data)
  }

  creatBulkCarouselUpload(data: any) {
    return this.http.post(this.host + "/home/create/carousel/bulk", data)
  }

  FetchAllCarousel() {
    return this.http.get(this.host + "/home/get/carousel")
  }

  updateCarousel(data: any) {
    return this.http.put(this.host + "/home/update/carousel/bulk", data)
  }

  deleteCarouselById(carouselId: string) {
    return this.http.delete(this.host + "/home/delete/carousel/" + carouselId)
  }

  createDeliveryCharge(data: any) {
    return this.http.post(this.host + "/delivery/create", data)
  }
  updateDeliveryCharge(data: any) {
    return this.http.put(this.host + "/delivery/update", data)
  }

  getAllDeliveryCharge() {
    return this.http.get(this.host + "/delivery/get/all")
  }

  FetchAllCategoriesByType(categoryType: string) {
    return this.http.get(this.host + "/category/get/category/" + categoryType);
  }
  FetchAllCategories() {
    return this.http.get(this.host + "/category/get/all/category/admin");
  }

  FetchAllCategoriesWithPagination(pageNo: number) {
    return this.http.get(this.host + "/category/get/page/all?page=" + pageNo);
  }

  createNewCategory(data: any) {
    return this.http.post(this.host + "/category/create", data)
  }

  updateCategory(data: any) {
    return this.http.put(this.host + "/category/update", data)
  }

  updateSubCategory(data: any) {
    return this.http.put(this.host + "/category/subcategory/update", data)
  }

  createNewSubCategory(data: any) {
    return this.http.post(this.host + "/category/subcategory/create", data)
  }


  FetchAllUnconfirmedOrderWithFilters(pageNo: number, data: any) {
    return this.http.post(this.host + "/order/get/All/previewOrder?page=" + pageNo, data);
  }

  // FetchAllOrderWithDoorDelivery(pageNo: number, data: any) {
  //   return this.http.post(this.host + "/order/get/page/all?page=" + pageNo, data);
  // }

  FetchOrderByIdForUsers(orderId: string) {
    return this.http.get(this.host + "/order/get/" + orderId);
  }

  updateBillStatus(data: any, orderId: string) {
    return this.http.put(this.host + "/order/update/bill/status/" + orderId, data);
  }

  updateUnconfirmOrderStatus(data: any, orderId: string) {
    return this.http.put(this.host + "/order/update/preview/status/" + orderId, data);
  }

  updateOrderStatusAsDispatch(data: any, orderId: string) {
    return this.http.put(this.host + "/order/update/status/dispatch/" + orderId, data);
  }



  // 18 Jun 2023
  FetchProductsByCatType(categoryType: string) {
    return this.http.get(this.host + "/product/get/category/" + categoryType);
  }

  FetchCartProducts(data: any) {
    return this.http.post(this.host + "/order/cart", data)
  }

  FetchCartProductsWithoutCharges(data: any) {
    return this.http.post(this.host + "/order/cart/without/charges", data)
  }

  EditOrder(data: OrderModel) {
    return this.http.put(this.host + "/order/update", data)
  }

  FetchSearchProductsByKeyWord(search: string, adminSearch: boolean = true) {
    return this.http.get(this.host + "/product/get/search/" + search + "?adminSearch=" + adminSearch);
  }

  // 10 Oct 2023
  FetchAllArea(pageNo: number, data: any) {
    return this.http.post(this.host + "/area/get/page/all?page=" + pageNo, data);
  }

  // 28 Jan 2024
  AddNewArea(data: areaModel) {
    return this.http.post(this.host + "/area/add/new/area", data)
  }

  editArea(data: areaModel) {
    return this.http.post(this.host + "/area/edit/area", data)
  }

  deleteArea(data: areaModel) {
    return this.http.post(this.host + "/area/delete", data)
  }

  getEditArea(areaId: string) {
    return this.http.get(this.host + "/area/get/area/" + areaId)
  }

  previewPrintPage() {
    return this.http.get(this.host + "/whatsApp/dynamic");
  }

  // May 18 2024
  // FetchParcelServiceProvider(pageNo: number) {
  //   return this.http.get(this.host + "/parcel/get/page/all?page=" + pageNo);
  // }

  FetchParcelServiceProviderList() {
    return this.http.get(this.host + "/parcel/get/providers");
  }

  FetchAllParcelServiceProviderList() {
    return this.http.get(this.host + "/parcel/get/providers/All");
  }

  AddNewService(data: parcelModel) {
    return this.http.post(this.host + "/parcel/add/provider", data)
  }

  AddNEwLcationToProvider(data: parcelModel) {
    return this.http.post(this.host + "/parcel/add/location", data)
  }

  EditLcationProvider(data: parcelModel) {
    return this.http.put(this.host + "/parcel/edit/location", data)
  }

  EditProvider(data: ParcelProviders) {
    return this.http.put(this.host + "/parcel/edit/providers", data)
  }

  FetchLocationByLocationId(locationId: string) {
    return this.http.get(this.host + "/parcel/get/location/" + locationId);
  }

  // May 21 2024
  FetchProductsBySubCatType(categoryType: string) {
    return this.http.get(this.host + "/product/get/subCategory/" + categoryType);
  }

  // Jun 09 2024
  FetchAllCourier(pageNo: number) {
    return this.http.get(this.host + "/courier/get/all?page=" + pageNo);
  }


  updateTrackingNo(data: OrderModel) {
    return this.http.put(this.host + "/order/update/courier/tracking", data)
  }

  FetchOrderByIdForCourier(orderId: string) {
    return this.http.get(this.host + "/order/get/courier/" + orderId);
  }

  FetchParcelList(parcelSearchText: string, pageNo: number) {
    return this.http.get(this.host + "/parcel/search/" + parcelSearchText + "?page=" + pageNo);
  }

  // SEPT 30 2024
  FetchCartAvailabilityProducts(data: any, newGardenEdit: boolean = false) {

    let params = new HttpParams();
    if (newGardenEdit) {
      params = params.set('admin', 'true');
    }

    return this.http.post(`${this.host}/order/availability`, data, { params });
  }

  // OCT 10 2024
  FetchAllOrdersDispatched(pageNo: number, data: any) {
    return this.http.post(`${this.host}/order/get/All/dispatch?page=${pageNo}`, data);
  }

  // NOV 16 2024
  FetchReports(data: any) {
    return this.http.post(this.host + "/order/get/reports", data, { responseType: 'blob', observe: 'response' });
  }

  // NOV 25 2024
  FetchProductReports() {
    return this.http.get(this.host + "/product/get/reports", { responseType: 'blob', observe: 'response' });
  }

  FetchPaymentReports(data: any) {
    return this.http.post(this.host + "/payment/get/reports", data, { responseType: 'blob', observe: 'response' });
  }

  // DEC 05 2024
  FetchRepaymentUrl(orderId: String) {
    return this.http.get(this.host + "/payment/regenerate/" + orderId);
  }

  UpdatePaymentData(data: PaymentRegenerateModel) {
    return this.http.post(this.host + "/payment/update/payment/status", data);
  }

  //Dec 26 2024
  FetchRepaymentDetails(orderId: String) {
    return this.http.get(this.host + "/repayment/get/" + orderId);
  }

  // 

  FetchNewGardenCartProducts(data: any) {
    return this.http.post(this.host + "/order/new/garden/cart", data)
  }

  FetchStateCityCall(pinCode: number | undefined, countryCode: string) {
    return this.http.get("https://api.worldpostallocations.com/?postalcode=" + pinCode + '&countrycode=' + countryCode)
  }
  creatGardenOrder(data: any) {
    return this.http.post(this.host + "/order/create/new/garden", data)
  }

  createProductOrder(data: any) {
    return this.http.post(this.host + "/order/create/without/charges", data)
  }

  FetchHubLocationByParcelServiceProviderAndStateAndPlants(parcelServiceProvider: string, state: string, isPlantsDeliverable: boolean) {
    return this.http.get(this.host + "/parcel/get/ByProvider/" + parcelServiceProvider + '/' + state + "/" + isPlantsDeliverable);
  }

  FetchUserAddress(phoneNo: number) {
    return this.http.get(this.host + "/order/get/user/details/" + phoneNo)
  }

  //March 10 2025
  FetchAllRefundOrderWithFilters(pageNo: number, data: any) {
    return this.http.post(this.host + "/refund/get/page/all?page=" + pageNo, data);
  }

  FetchRefundOrderById(orderId: string | number, pageNo: number) {
    return this.http.get(this.host + "/refund/get/" + orderId + "?page=" + pageNo);
  }

  // Mar 16 2025
  FetchAllCourierWithouPagination() {
    return this.http.get(this.host + "/courier/get");
  }


  //March 30 2025
  FetchAllPaymentCompletedOrderWithFilters(pageNo: number, data: any) {
    return this.http.post(this.host + "/paymentC/get/page/all?page=" + pageNo, data);
  }

  FetchPaymentCompletedOrderById(orderId: string | number, pageNo: number) {
    return this.http.get(this.host + "/paymentC/get/" + orderId + "?page=" + pageNo);
  }

  FetchProductsByGardenCatType(categoryType: string) {
    return this.http.get(this.host + "/product/get/new-garden/" + categoryType);
  }

  // April 21 2025
  FetchNewGardenCartProductsAdmin(data: any) {
    return this.http.post(this.host + "/new-garden-setup/cart", data)
  }

  FetchNewGardenCreateAdmin(data: any) {
    return this.http.post(this.host + "/order/new-garden-setup/create", data)
  }
  // July 07 2025

  FetchPlantsSummaryWithFilters(data: { fromDate: string; toDate: string }) {
    const params = new HttpParams()
      .set('fromDate', data.fromDate + 'T00:00:00')
      .set('toDate', data.toDate + 'T23:59:59');

    return this.http.get(`${this.host}/order/plant-summary`, { params });
  }

  FetchPlantsSummaryReports(data: { fromDate: string; toDate: string }) {
    const params = new HttpParams()
      .set('fromDate', data.fromDate + 'T00:00:00')
      .set('toDate', data.toDate + 'T23:59:59');

    return this.http.get(`${this.host}/order/get/plant-summary/reports`, { params, responseType: 'blob', observe: 'response' });
  }


  // JULY 20 2025
  FetchGSTOrderReports(data: any, gstFiltre: any) {
    const params = new HttpParams()
      .set('isGSTReport', true)
      .set('modeOfDelivery', gstFiltre.modeOfDelivery || 'ALL');
    return this.http.post(this.host + "/order/get/gst/reports", data, { params, responseType: 'blob', observe: 'response' });
  }

  // Sept 13 2025
  FetchParcelFilters() {
    return this.http.get(this.host + "/parcel/get/filters");
  }

  FetchParcelServiceProvider(filters: filterValues, pageNo: number) {
    const params = new HttpParams()
      .set('state', filters.state || '')
      .set('district', filters.district || '')
      .set('provider', filters.providers || '');
    return this.http.get(this.host + "/parcel/get/page/all?page=" + pageNo, { params });
  }


  FetchProductsByCategoryAvaliabilityAndsearch(filters: productfilterValues, pageNo: number) {
    const params = new HttpParams()
      .set('categoryType', filters.categoryType || '')
      .set('availability', filters.availability || '')
      .set('search_text', filters.search_text || '');
    return this.http.get(this.host + "/product/get/page/all?page=" + pageNo, { params });
  }

  //  20 Oct 2025
  FetchDashBoardAnalytics() {
    return this.http.get(this.host + "/admin/api/dashboard/analytics");
  }

  FetchDashBoardChartAnalytics() {
    return this.http.get(this.host + "/admin/api/dashboard/weekly-orders");
  }

  FetchDashBoardChartAnalyticsOut_Of_Stock() {
    return this.http.get(this.host + "/admin/api/dashboard/out-of-stock-count");
  }

  FetchDashBoardSalesCharges(data: AnalyticsFilterModel) {
    return this.http.post(this.host + "/admin/api/dashboard/delivery-charges", data);
  }

  FetchTop10ThresoldProducts(data: AnalyticsFilterModel) {
    return this.http.post(this.host + "/admin/api/dashboard/stock-lesser-than-threshold-count/top10", data);
  }

  FetchCouierAnalytics(data: AnalyticsFilterModel, modeOfDelivery: string) {
    return this.http.post(this.host + "/admin/api/dashboard/delivery-charges/" + modeOfDelivery, data);
  }


  getDDANDNGSpayment(orderId: string) {
    return this.http.get(this.host + "/order/get/DDANDNGSStatus/" + orderId);
  }

  getDDANDNGSOrderManager(data: any) {
    return this.http.post(this.host + "/order/get/DDANDNGSOrderManager", data);
  }

  getDDANDNGSOrderList(data: any) {
    return this.http.post(this.host + "/order/get/DDANDNGSOrderList?page=" + data.page, data);
  }

  // 28 March 2026
  getExportStatus(jobId: string): Observable<any> {
    return this.http.get(`${this.host}/order/export/status/${jobId}`);
  }

  downloadGSTFile(jobId: string): Observable<Blob> {
    return this.http.get(`${this.host}/order/export/download/${jobId}`, { responseType: 'blob' });
  }
  startExportGST(filter: any, isGstReport: boolean, modeOfDelivery: string): Observable<string> {
    return this.http.post(`${this.host}/order/get/gst/reports?isGstReport=${isGstReport}&modeOfDelivery=${modeOfDelivery}`, 
      filter,{responseType: 'text'});
  } 
  
}

