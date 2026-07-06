
import { OrderStatusEnum, OrderStatusModel, PaymentStatusEnum } from "../Model/products";
import { CartModel, NewGardenSetUpCartModel, OrderCommentsModel, PaymentStatusModel, UserModel } from "./cart";

export interface OrderModel {

  id: String;
  orderId: String;
  transactionId: String;
  orderDate: Date;
  paymentDate: Date;
  paymentConfirmationDate: Date;
  deliveryDate: Date;
  user: UserModel;
  deliveryInstruction: String;
  cartModel: CartModel;
  gardenCartModel: NewGardenSetUpCartModel;
  orderStatusText: OrderStatusEnum;
  paymentStatusText: PaymentStatusEnum;
  orderStatus: OrderStatusModel[];
  paymentStatus: PaymentStatusModel[];
  totalAmount: number;
  redirectURI: String;
  parcelTrackingId: String;
  parcelServiceProviderName: String;
  parcelServiceHubName: String;
  parcelServiceHubAddress: String;
  isChennaiLocation: Boolean;
  isParcelService: Boolean;
  orderConfirmationMessage: Boolean;
  dispatchConfirmationMessage: Boolean;
  wOrderConfirmationMessage: Boolean;
  wDispatchConfirmationMessage: Boolean;
  modeOfDelivery: String;
  billPrinted: Boolean;
  isCallConnected: Boolean;
  totalTransportationCost: number;
  totalLiftingCost: number;
  reasonForCancelling: String;
  comments: OrderCommentsModel[];
  autoFailureCheck: Boolean;
  attemptsMade: number;
}


export interface addressBaseComponent {
  addressLine1?: any,
  addressLine2?: string,
  state?: string,
  city?: string,
  pinCode?: number,
  country?: string,
  district?: string,
}

export interface checkout {
  name?: string | any,
  phone?: string | any,
  alternativePhone?: string | any,
  email?: string | any,
  address?: addressBaseComponent | any,
  deliveryInstruction?: string,
  cartModel?: any
  gstIn?: string
}

export interface productPriceAndQuantity {
  unit: number,
  mass: string,
  quantity: number,
  productId: string
}

export interface countryDetails {
  countryName: string,
  flag: string,
  callingCodes: number,
}

export interface hubDetails {
  id: number;
  isSelected: boolean;
  hubLocation: string,
  hubAddress: string,
  hubGoogleLocation: string,
  district: string,
  locationId?: string
}

export interface hub {
  hubLocation: string,
  hubAddress: string,
  hubGoogleLocation: string,
  district: string
}

export interface parcelServiceProvider {
  state: string,
  parcelServiceProvider: string,
  parcelServiceDetails: hubDetails[]
}

export interface cartProductPriceAndQuantity {
  unit?: number,
  mass?: string,
  productId: string,
  quantity: number,
  soilMixQtyMass?: string,
  soilMixQtyUnit?: number,
  growBagName?: string,
  soilMixName?: string
}

export enum CartOperation {
  ADD = 'add',
  REMOVE = 'remove',
  DELETE = 'delete'
}

export interface Cart {
  items: Array<CartItem>;
}

export interface CartItem {
  unit: number;
  mass: string;
  quantity: number;
  productId: number;
}


