import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmationService } from 'primeng/api';
import { CartModel, CartProductModel, MassEnum, OrderModel, ProductModel, UserModel } from 'src/app/Data/cart';
import { addToCArt, products } from 'src/app/Product/single-product/single-product.component';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';
import { CartOperation, cartProductPriceAndQuantity, CartService, localstorageEnum } from 'src/app/services/cart-service/cart.service';
import { CartItem } from 'src/app/Model/cart.model';
import { hubDetails } from 'src/app/Data/interface';
export enum CartType {
  gardenSetup = "gardenSetup",
  products = "products"
}

export type productDetails = {
  productList: ProductModel,
  unit: number, mass: MassEnum
}


type productCompare = {
  mass: string
  mrp: number
  offer: number
  packOf: number
  price: number
  productId: string
  quantity: number
  unit: number
  youSave: number
}

@Component({
  selector: 'app-order-update',
  templateUrl: './order-update.component.html',
  styleUrls: ['./order-update.component.css']
})
export class OrderUpdateComponent implements OnInit, OnDestroy {
  protected orderId: string = '';
  cart: OrderModel[] = [];
  CartType = CartType;
  public showCartType: boolean[] = [true, false]
  public imageSrc: string;

  originalOrderData: OrderModel[] = [];
  products: ProductModel[] = [];
  sidebarVisible1: boolean = false;
  newlyAdded: any[] = [];
  userModel = {} as UserModel;
  isNewGarden: boolean = false;
  public cartProducts: any = [];
  cartOperation = CartOperation;
  unavailableProdIds: string[] = [];

  constructor(private router: Router,
    private actRoute: ActivatedRoute,
    private jsonHttpService: JsonHttpService,
    private cartService: CartService,
    private confirmationService: ConfirmationService) {
    this.imageSrc = JsonHttpService.imageURL
  }
  ngOnDestroy(): void {
    this.cartService.deleteLocalStorage(this.orderId);
  }

  ngOnInit(): void {
    this.orderId = this.actRoute.snapshot.params['orderId'];
    if (!this.orderId) {
      this.router.navigate(['/order-overview']);
      return
    }
    this.cartService.deleteLocalStorage(this.orderId);
    this.getOrdersFromOrderId();
    // this.getProductsFromLocalStorage();
  }

  async getOrdersFromOrderId() {
    try {
      const data: any = await new Promise((resolve, reject) => {
        this.jsonHttpService.FetchOrderByIdForUsers(this.orderId).subscribe({
          next: (response: any) => resolve(response),
          error: (err: any) => reject(err)
        });
      });

      this.originalOrderData = await data.data;
      this.userModel = await data.data[0].user;
      this.isNewGarden = this.originalOrderData[0]?.gardenCartModel ? true : false;

      await data.data[0].cartModel.products.forEach((data: CartProductModel) => {

        this.newlyAdded.push({
          unit: data.unit,
          mass: data.mass,
          productId: data.productId,
          quantity: data.quantity
        });
      });

      await this.cartService.updateLocalStorage(this.orderId, this.newlyAdded);

      this.getProductDetails();

    } catch (error) {
      // Handle error
    }
  }


  getProductDetails() {

    let createOrder: any = {};
    let products: any = {};

    if (this.newlyAdded.length > 0) {
      products['products'] = this.newlyAdded;
      createOrder['cartModel'] = products;
      this.jsonHttpService.FetchCartAvailabilityProducts(createOrder, true).subscribe({
        next: (data: any) => {
          this.cart = data.data;
        }, error: (error) => {
          this.cart = [];
          this.jsonHttpService.sendToastMessage('', error.error.statusText, "failure");
        }
      })
    } else {
      this.cart = [];
    }
  }

  async getProductsFromLocalStorage() {
    let cart = await this.cartService.getLocalStorageValue(this.orderId);
    if (cart != null) {
      this.newlyAdded = cart;
      this.getProductDetails();
    }
  }

  addRemoveProducts(product: CartProductModel, whatToDo: string) {
    this.cartService.addCart({
      unit: product.unit,
      mass: product.mass,
      productId: product.productId,
      quantity: 1
    }, whatToDo as CartOperation, this.orderId);

    this.getProductsFromLocalStorage();
  }


  routeToProduct(prodId: string) {
    this.router.navigate(['/product/' + prodId])
  }

  refreshProductList(event: addToCArt) {
    this.cartService.addCart({
      unit: event.unit,
      mass: event.mass,
      productId: event.productList.productId,
      quantity: 1
    }, event.whatToDo as CartOperation, this.orderId);
    this.getProductsFromLocalStorage();
  }


  getProdCountForOriginal(productList: CartProductModel) {
    return productList.quantity
  }

  getOriginalCount() {
    return this.isNewGarden ? this.originalOrderData[0]?.gardenCartModel.products.length
      : this.originalOrderData[0]?.cartModel.products.length
  }


  getProdCount(productList: CartProductModel, isNewlyAdded?: boolean) {
    if (isNewlyAdded) {
      return this.countForNewlyAdded(productList);
    }
    return 0
    // return this.productServiceService.prodCount(productList, this.showCartType[0] ? false : true, this.orderId)
  }

  async updateOrderList() {
    if (this.checkForUnavailables()) {
      if (await this.confirm("Are you sure that you want to remove unavailable product(s)?")) {
        await this.unavailableProductsRemove();
      }
    }

    let prod = {} as CartModel;
    let modifiedOrder: OrderModel[] = [];
    prod['products'] = await this.cartService.getLocalStorageValue(this.orderId)!;
    modifiedOrder = await this.calculateNewlyAddedProd(prod);
    if (await this.editOrder(modifiedOrder[0])) {
       this.cartService.deleteLocalStorage(this.orderId);
    }
   

  }

  checkForUnavailables() {

    this.cart[0].cartModel.products.forEach((element: any) => {
      if (!element.productModel.productDetails.length) {
        this.unavailableProdIds.push(element.productModel.productId)
      }
    });

    return this.unavailableProdIds.length;
  }

  async unavailableProductsRemove() {
    let purchaseProduct: CartItem[];
    purchaseProduct = this.cartService.getLocalStorageValue(this.orderId);
    purchaseProduct.forEach((product: CartItem) => {
      this.unavailableProdIds.forEach((productId: string) => {
        if (productId == product.productId) {
          this.cartService.addCart({
            unit: product.unit,
            mass: product.mass,
            productId: product.productId,
            quantity: 1
          }, CartOperation.REMOVE, this.orderId)
        }
      })
    })

  }


  async updateOrder() {
    if (!await this.confirm("Are you sure that you want to updates?")) {
      return
    }
    this.updateOrderList();
  }


  akka(productsList: ProductModel, doWhat: string, unit: number, mass: MassEnum) {
    let purchaseProduct = {} as any;
    purchaseProduct['productId'] = productsList.productId;
    purchaseProduct['quantity'] = 1;
    purchaseProduct['unit'] = unit;
    purchaseProduct['mass'] = mass;

    if (this.newlyAdded.length) {

      let checker = false;
      this.newlyAdded.forEach((element: any, index: number) => {
        if (element.productId == productsList.productId && element.unit == unit && element.mass == mass) {
          checker = true;
          if (doWhat == CartOperation.ADD) {
            this.newlyAdded[index].quantity = element['quantity'] + 1;
          } else if (doWhat == CartOperation.REMOVE) {
            if (this.newlyAdded[index].quantity > 1) {
              this.newlyAdded[index].quantity = element['quantity'] - 1
            } else {
              this.newlyAdded.splice(index, 1);
            }
          }
          else if (doWhat == CartOperation.DELETE) {
            this.newlyAdded.splice(index, 1);
          }
        }
      })

      if (!checker) {
        this.newlyAdded.push(purchaseProduct);
        this.jsonHttpService.sendToastMessage('', 'Added to the cart', "success");
      }

    } else {
      this.newlyAdded.push(purchaseProduct);
    }
  }

  async editOrder(data: OrderModel): Promise<boolean> {
    this.originalOrderData[0].cartModel = data.cartModel
    return new Promise((resolve, reject) => {
      this.jsonHttpService.EditOrder(this.originalOrderData[0]).subscribe({
        next: (data: any) => {
          this.cart = data.data;
          resolve(true);
        },
        error: (error) => {
          this.cart = [];
          this.jsonHttpService.sendToastMessage('', error?.error?.statusText, "failure");
          reject(false);
        }
      })
    })
  }

  async calculateNewlyAddedProd(prod: CartModel): Promise<OrderModel[]> {
    return new Promise((resolve, reject) => {
      this.jsonHttpService.FetchCartProductsWithoutCharges({ cartModel: prod }).subscribe({
        next: (data: any) => { resolve(data.data) },
        error(err) { reject(err) },
      })
    })
  }

  confirm(message: string): Promise<boolean> {
    return new Promise(resolve => {
      this.confirmationService.confirm({
        message: message,
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => {

          resolve(true);
        },
        reject: () => {
          resolve(false);
        }
      })
    });
  }


  search(value: string) {
    this.jsonHttpService.FetchSearchProductsByKeyWord(value).subscribe({
      next: (data: any) => {
        this.products = data.data;
      }, error: (error: any) => {
        this.products = [];
      }
    })
  }

  updateProvider(event:{hubDetails:hubDetails, provider: string}){    
    this.originalOrderData[0]['parcelServiceProviderName'] = event.provider;
    this.originalOrderData[0]['parcelServiceHubName'] = event.hubDetails.hubLocation;
    this.originalOrderData[0]['parcelServiceHubAddress'] = event.hubDetails.hubAddress;
    this.originalOrderData[0]['parcelLocationId'] = event.hubDetails.locationId;
  }


  removeProdFromOriginalOrder(productsList: ProductModel, doWhat: string, unit: number, mass: MassEnum) {
    this.cartProducts = [];
    let prod = {} as CartModel;

    this.originalOrderData[0].cartModel.products.forEach((element: any, index: number) => {
      let purchaseProduct = {} as cartProductPriceAndQuantity;
      purchaseProduct['productId'] = element.productId;
      purchaseProduct['quantity'] = element.quantity;
      purchaseProduct['unit'] = element.unit;
      purchaseProduct['mass'] = element.mass;
      this.cartProducts.push(purchaseProduct);

      if (element.productId == productsList.productId && element.unit == unit && element.mass == mass) {
        if (doWhat == CartOperation.REMOVE) {
          if (this.cartProducts[index].quantity > 1) {
            this.cartProducts[index].quantity = element['quantity'] - 1
          } else {
            this.cartProducts.splice(index, 1);
          }
        } else if (doWhat == CartOperation.DELETE) {
          this.cartProducts.splice(index, 1);
        }
      }
    })

    prod['products'] = this.cartProducts;

    if (this.cartProducts.length < 1) {
      return
    }

    this.jsonHttpService.FetchCartProducts({ cartModel: prod }).subscribe({
      next: (data: any) => {
        this.originalOrderData[0].cartModel = data.data[0].cartModel;
        //  this.originalOrderData[0].totalAmount = data.data[0].totalAmount;
      },
      error: (error) => {
        if (error.error.statusText == "No products have been added to the cart yet !") {
        }
        this.jsonHttpService.sendToastMessage('', error.error.statusText, "failure");
      }
    })
  }

  countForNewlyAdded(productList: CartProductModel) {
    if (this.newlyAdded.length) {
      let quantity: number = 1;
      this.newlyAdded.forEach((element: any) => {
        if (element.productId == productList.productId && element.unit == productList.unit && element.mass == productList.mass) {
          quantity = element.quantity;
        }
      })
      return quantity;
    } else {
      return 0;
    }
  }


  areObjectsIdentical(obj1: any, obj2: any): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if the number of keys is the same
    if (keys1.length !== keys2.length) {
      return false;
    }

    // Check if all keys and their values are identical
    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    // Objects are identical
    return true;
  }


}
