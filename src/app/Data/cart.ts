import { OrderStatusEnum, OrderStatusModel, PaymentStatusEnum } from "../Model/products"

export enum MassEnum {
    gm, Kg, ml, L
}

export type UserModel = {

    name: string
    phone: number
    alternativePhone: number
    email: string
    address: AddressModel
}

export type AddressModel = {

    addressLine1: string
    addressLine2: string
    city: string
    state: string
    country: string
    pinCode: number
    isChennaiLocation: Boolean
}
export type CartProductModel = {

    productId: string
    productModel: ProductModel
    unit: number
    mass: MassEnum
    quantity: number
    packOf: number
    mrp: number
    price: number
    offer: number
    youSave: number
}
export type CartModel = {

    products: CartProductModel[]
    totalNoOfProducts: number
    totalNoOfQuantity: number
    totalMrp: number
    totalPrice: number
    totalOffer: number
    totalYouSave: number
    totalDeliveryCharge: number
    totalPackingCharge: number
    totalKgs: number
    isChennaiDelivery: Boolean
}

export type ProductModel = {

    productId: string
    productCreatedOn: Date
    productUpdatedOn: Date
    productNameInEnglish: string
    productNameInTamil: string
    productDescription: string
    productCategory: string
    productSubCategory: string
    productImages: string[]
    productSetupImages: string[]
    productManufacturedOn: Date
    productSortOrder: string
    productExpiryOn: Date
    productDetails: ProductDetailsModel[]
    productDeleted: boolean
    purchasedCount: number
    availableNoOfProducts: number
    availableProductsLoaded: Date
}

export type NewGardenSetUpCartProductModel = {

    productId: string
    productModel: ProductModel
    quantity: number
    growBagName: string
    soilMixName: string
    growBagImage: string
    soilMixImage: string
    productImage: string
    productName: string
    mrp: number
    price: number
    offer: number
    youSave: number
    soilMixQtyUnit: number
    soilMixQtyMass: MassEnum
}
export type NewGardenSetUpCartModel = {

    products: NewGardenSetUpCartProductModel[];
    totalNoOfProducts: number;
    totalNoOfQuantity: number
    totalMrp: number
    totalPrice: number
    totalOffer: number
    totalYouSave: number
    totalDeliveryCharge: number
    totalPackingCharge: number
    totalKgs: number
    isChennaiDelivery: Boolean
}

export type PaymentStatusModel = {

    dateOn: Date;
    status: PaymentStatusEnum;
    comments: string;
}

export type OrderModel = {
    value: { courierProvider: any }
    orderId: string;
    transactionId: string;
    orderDate: Date;
    paymentDate: Date;
    paymentConfirmationDate: Date;
    deliveryDate: Date;
    user: UserModel;
    deliveryInstruction: string;
    cartModel: CartModel;
    gardenCartModel: NewGardenSetUpCartModel;
    orderStatusText: OrderStatusEnum;
    paymentStatusText: PaymentStatusEnum;
    orderStatus: OrderStatusModel[];
    paymentStatus: PaymentStatusModel[];
    totalAmount: number;
    redirectURI: string;
    parcelTrackingId: string;
    parcelServiceProviderName: string;
    parcelServiceHubName: string;
    parcelServiceHubAddress: string;
    parcelLocationId:string|any;
    isChennaiLocation: boolean;
    isParcelService: boolean;
    orderConfirmationMessage: boolean;
    dispatchConfirmationMessage: boolean;
    wOrderConfirmationMessage: boolean;
    wDispatchConfirmationMessage: boolean;
    modeOfDelivery: string;
    billPrinted: boolean;
    isCallConnected: boolean;
    totalTransportationCost: number;
    totalLiftingCost: number;
    reasonForCancelling: string;
    comments: OrderCommentsModel[];
    autoFailureCheck: Boolean;
    attemptsMade: number;
    courierDetails: CourierTrackingModel;
    whatsappDetails: WhatsappMessageResponseModel
}
export type WhatsappMessageResponseModel = {
    orderConfirmationMessage: boolean
    orderShippedMessage: boolean
    orderDispatchMessage: boolean
}
export type CourierTrackingModel = {
    courierTrackingNo?: string;
    courierProvider?: string;
    trackingLink?: string;
}

export type OrderCommentsModel = {

    comments: string;
    commentsCreatedDate: Date;
}

export enum AvailabilityEnum {
    IN_STOCK = "IN_STOCK", OUT_OF_STOCK = "OUT_OF_STOCK" , CURRENTLY_UNAVAILABLE = "CURRENTLY_UNAVAILABLE"
}

export type ProductDetailsModel = {

    unit: number
    mass: MassEnum
    packOf: number
    mrp: number
    price: number
    offer: number
    youSave: number
    availabilityDate: Date
    availableNoOfProducts: number
    availability: AvailabilityEnum
    width: number
    height: number
    length: number
    color: string

}

// export type ProductNewGardenDetailsModel = {
//     growBagImage: string
//     growBagName: string
//     soilMixImage: string
//     soilMixName: string
//     productImage: string
//     productName: string
//     soilMixQtyUnit: number
//     soilMixQtyMass: MassEnum
//     totalSetUpPrice: number
//     productDescription: string
//     mrp?: number
//     price?: number
//     offer?: number
//     youSave?: number
//     purchasedCount?: number
// }

