
export type SortAndGroup = {
  productNameInEnglish: string,
  productId: string,
  productSort?: number,
  productGroup?: number
}


export enum ModeOfDeliveryEnum {
  DoorDelivery = "DoorDelivery",
  Parcel = "Parcel",
  Courier = "Courier",
}

export enum OrderStatusEnum {

  newOrder = "newOrder",
  dispatched = "dispatched",
  cancelled = "cancelled",
  cancelledManually = "cancelledManually",
  onHold = "onHold",
  inProgress = "inProgress",
  clear = "clear"
}

export enum PaymentStatusEnum {
  initiated = "initiated",
  processing = "processing",
  captured = "captured",
  COMPLETED = "COMPLETED",
  failure = "failure",
  timeOut = "timeOut",
  refundInitiatedManually = "refundInitiatedManually"
}

export type OrderUpdateModel = {

  orderStatus?: OrderStatusEnum,
  totalTransportationCost?: number,
  totalLiftingCost?: number,
  reasonForCancelling?: string,
  paymentStatus?: PaymentStatusEnum,

}

export type OrderStatusModel = {

  dateOn?: Date;
  status?: OrderStatusEnum;
  comments?: string;
  parcelTrackingId?: string;
  billPrinted?: boolean;
}



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
  productCategory: string,
  productSubCategory: string,
  productImages: any,
  productId: string,
  productDetails: productDetails[],
  productSetupDetails: ProductNewGardenDetailsModel[],
  availableNoOfProducts: number
  productNewGardenCategory: String
  productSetupImages: String[]
  productManufacturedOn: Date
  productSortOrder: String
  productExpiryOn: Date
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
  Acccessories = 'Accessories',
  Seeds = 'Seeds',
  Pots = 'Pots',
  Tools = 'Tools'
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
  isRecommended?: boolean;
  potImage?: string;
  potName?: string;

  productVariants?: VariantModel[],
  productBaseVariant: VariantModel | null
}
export type VariantModel = {
  growBagImage: string | null;
  growBagName: string | null;
  potImage: string | null;
  potName: string | null;
}

export type CartProductModel = {

  productId: String
  productModel: products
  unit: Number
  mass: MassEnum
  quantity: Number
  packOf: Number
  mrp: Number
  price: Number
  offer: Number
  youSave: Number
  gst: Number
  originalPrice: Number
  dimensionDetailsModel: productDimensionDetailsModel
}

export type productDimensionDetailsModel = {
  width: Number
  height: Number
  length: Number
  dimensionEnum: DimensionEnum
}


enum DimensionEnum {
  ft, cm
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


export interface Category {
  productSubCategoryDetails: SubCategory[],
  totalNoOfProducts: number,
  productCategory: string,
  categoryCreatedOn: Date,
  categoryUpdatedOn: Date,
  productCategoryImage: string
}

export interface SubCategory {
  productSubCategoryName: string,
  productSubCategoryImageForMobile: string,
  totalNoOfProducts: number,
  subCategoryCreatedOn: Date;
  subCategoryUpdatedOn: Date
  productSubDivisionDetails: SubDivisionModel[];
}
export type SubDivisionModel = {
  productSubDivisionName: string;
  productSubDivisionImageForMobile: string;
  totalNoOfProducts?: number;
  subCategoryId?: string;
  subDivisionDeleted?: Boolean;
  subDivisionCreatedOn?: Date;
  subDivisionUpdatedOn?: Date;
}

export interface subCatRoute {
  productCategory: string
  productSubCategoryName: string
}

export enum GetType {
  getProductByCategory = 'getProductByCategory',
  getProductByCategoryAndSubCAt = 'getProductByCategoryAndSubCAt',
}

