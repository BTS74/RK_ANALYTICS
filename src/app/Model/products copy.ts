
export enum MassEnum {
  gm = 'gm', Kg = 'Kg', ml = 'ml', L = 'L'
}

export enum AvailabilityEnum {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK'
}

export interface ProductDetailsModel {

  unit: number,
  mass: MassEnum.gm,
  productVariantId: string,
  productId: string,
  packOf: number,
  mrp: number,
  availability: AvailabilityEnum.IN_STOCK;
  price?: number,
  originalPrice?: number,
  offer: number,
  youSave?: number
  productNameInEnglish: string,
  position: number,
  productSize: string[],
  productImages: string[],

}

export type products = {
  productNameInEnglish: string,
  productNameInTamil: string,
  productDescription: string,
  productCategory: CategoriesToShowPackOf,
  productSubCategory: string,
  productImages: any,
  productId: string,
  productDetails: productDetails[],
  productSetupDetails: ProductNewGardenDetailsModel[],
  availableNoOfProducts: number,
  productSort: number,
  productGroup: number
  damagedCounts: number
}

export type SortAndGroup = {
  productNameInEnglish: string,
  productId: string,
  productSort?: number,
  productGroup?: number
}

export enum ToastType {
  success = 'success',
  failure = 'failure',
  error = 'error'
}

export interface ToastModel {
  message: string,
  title?: string,
  type: ToastType
}

export enum CategoriesToShowPackOf {
  Grow_bags = 'Grow Bags',
  Acccessories = "Accessories",
  Seeds = 'Seeds',
  Pots = 'Pots'
}
export type gardenSetUpCount = {
  productId: string
  soilMixQtyUnit: number;
  soilMixQtyMass: MassEnum.Kg;
}
export type ProductNewGardenDetailsModel = {
  growBagImage: string,
  growBagName: string,
  soilMixImage: string,
  soilMixName: string,
  productImage: string,
  productName: string,
  soilMixQtyUnit: number;
  soilMixQtyMass: MassEnum.Kg;
  totalSetUpPrice: number;
  productDescription: string,
  mrp: number;
  price: number;
  offer: number;
  youSave: number;
  purchasedCount: number;
}

export type productDetails = {
  unit: number,
  mass: string,
  packOf: number,
  mrp: number,
  offer: number,
  price: number,
  availability: string,
  height: number,
  length: number,
  width: number
}

export type productList = {
  unit: number,
  mass: string,
  productId: string,
  quantity: number
}

export enum CartType {
  gardenSetup = "gardenSetup",
  products = "products"
}


export type ProductDamageModel = {
  productId: string
  damagedCount: number
  reportedOn: Date
}

export type DDANDNGSPaymentTransactionModel = {


  orderId: string;   // VERY IMPORTANT for performance

  paymentStage: DDANDNGSPaymentStage;  // FIRST / SECOND / FINAL

  amount: number;

  paymentMode: string;

  paymentDate: Date;

  referenceId: string; //: string UPI ref / cash receipt / txn id
  paymentGateway: string;
}


export type ProductAvailabilityDTO = {

  availableNoOfProducts: number;
  productNameInEnglish: string;
  productId: string;
}

export enum DDANDNGSPaymentStage {
  FIRST,
  SECOND,
  FINAL
}
