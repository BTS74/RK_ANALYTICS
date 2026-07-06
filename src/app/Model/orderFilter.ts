import { UserModel } from "../Data/cart"
import { OrderStatusEnum, PaymentStatusEnum } from "./cart.model"
import { AvailabilityEnum, ModeOfDeliveryEnum } from "./products"

export interface filter {
  orderStatus?: string | any | null,
  startDate ?: any | Date | string,
  orderDate?: any | Date | string,
  orderStartDate?: any | Date | string,
  invoiceStartDate?: any | Date | string,
  invoiceEndDate?: any | Date | string,
  billPrintedEndDate?: any | Date | string,
  orderEndDate?: any | Date | string,
  paymentStatus?: string | any | null,
  paymentDate?: any | Date | string,
  modeOfDelivery?: any | string,
  typeOfProduct?: any | string;
  isCallConnected?: boolean | null,
  callConnectedStartDate?: any | Date | string,
  callConnectedEndDate?: any | Date | string,
  // minTotalAmount?: number | null,
  // maxTotalAmount?: number | null,
  deliveryEndDate?: any | Date | string,
  deliveryStartDate?: any | Date | string
  isOrderTrackingCompleted?: boolean
  isOrderCompleted?: boolean
  isPending?: boolean
  billPrinted?: boolean
  enableBillPrinted?: boolean
  // enableCallConnected?:boolean
  isUrgent?: boolean
}

export interface AllOrderAndPaymentFilterModel {

  orderDate?: Date
  orderStatus?: OrderStatusEnum
  paymentDate?: Date
  paymentStatus?: PaymentStatusEnum
  modeOfDelivery?: ModeOfDeliveryEnum
  user?: UserModel
  orderId?: string
  isCallConnected?: boolean
  minTotalAmount?: number
  maxTotalAmount?: number
}

export interface PaymentDoneOnAnotherGatewayModel {
  transactionId?: string;
  paymentGateway?: string;
  paymentOn?: any;
}

export interface PaymentRegenerateModel {
  orderId?: String
  paymentDoneOnAnotherGatewayModel: PaymentDoneOnAnotherGatewayModel
  createdOnDate?: any
  receivedManually?: boolean
  generatedList?: PaymentRegenerateListModel[];
}

export interface PaymentRegenerateListModel {
  transactionId?: string;
  paymentUrl?: string;
  generatedOn?: any
  linkVisitedCount?: number

}
export interface parcelFiltersModel {
  providers: string[]
  states: stateDistrictModel[]
}

export interface stateDistrictModel {
  name: string,
  districts: string[]
}

export interface filterValues {
  providers: string
  state: string
  district: string
}

export interface productfilterValues {
  categoryType?: string
  availability?: AvailabilityEnum | string | null
  search_text?: string
}

export interface parcelModel {

  locationId: string
  state: string
  parcelServiceProvider: string
  district: string
  hubLocation: string
  hubAddress: string
  hubGoogleLocation: string
  hubDeleted: boolean
  createdOn: Date
  isPlantsDeliverable: boolean
  editedOn: Date
}

export interface ParcelProviders {

  parcelServiceProviderId: string,
  parcelServiceProvider: string,
  parcelServiceProviderDeleted: boolean,
  trackingLink: string | null
}

export const IndianStates: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Lakshadweep',
  'Puducherry'
];


export interface statDetails {
  totalCancelledOrders: number;
  totalDispatchedOrders: number;
  totalNewOrders: number;
  totalRevenue: number;
}

export interface pageConfig {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  phoneNo: number;
  pageNo: number;
}