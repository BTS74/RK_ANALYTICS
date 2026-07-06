import { MassEnum, products } from "./products copy";

export interface Cart {
  items: Array<CartItem>;
}

export interface CartItem {
  productId: string,
  quantity: number;
  unit: number,
  mass: MassEnum.gm | string;
}

export interface GardenItem {
  productId: string
  quantity: number,
  soilMixQtyUnit?: number,
  soilMixQtyMass?: MassEnum.gm | string;
  unit?: number,
  mass?: MassEnum.gm | string;
  growBagName?: string | null
  potName?: string | null
  soilMixName?: string
  
}

export enum CartOperation {
  ADD = 'add',
  REMOVE = 'remove',
  DELETE = 'delete'
}


export interface CartModel {

  products: CartProductModel[];
  totalNoOfProducts: number,
  totalNoOfQuantity: number,
  totalMrp: number,
  totalPrice: number,
  totalOffer: number,
  totalYouSave: number,
  totalDeliveryCharge: number
}

export interface CartProductModel {

  productId: string;
  productModel: products;
  unit: number,
  mass: MassEnum,
  quantity: number,
  mrp: number,
  price: number,
  offer: number,
  youSave: number,
  variantId: string
  size: string
}

export interface OrderModel {
  orderId: string,
  transactionId: string,
  user: UserModel;
  deliveryInstruction: string,
  cartModel: CartModel;
  totalAmount: number,
  orderConfirmationMessage: boolean,
  dispatchConfirmationMessage: boolean,
  autoFailureCheck: boolean,
  orderDate: Date,
  orderStatusText: OrderStatusEnum | string;
  paymentStatusText: PaymentStatusEnum;
  orderStatus: OrderStatusModel[];
  paymentStatus: PaymentStatusModel[];

}

export interface OrderStatusModel {

  dateOn: Date,
  status: OrderStatusEnum | string,
  comments: string
}


export interface PaymentStatusModel {

  dateOn: Date,
  status: PaymentStatusEnum | string,
  comments: string
}

export enum PaymentStatusEnum {
  initiated, processing, captured, failure, timeOut
}
export enum OrderStatusEnum {
  newOrder, dispatched, cancelled
}

export interface UserModel {

  name: string,
  phone: number,
  email: string,
  address: AddressModel,
}

export interface AddressModel {

  addressLine1: string,
  addressLine2: string,
  city: string,
  state: string,
  country: string,
  pinCode: number
}