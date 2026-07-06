import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Cart, CartItem, MassEnum } from 'src/app/Model/cart';
import { JsonHttpService } from '../Json-Http/json-http.service';
export enum localstorageEnum {
  PRODUCTS = 'products',
  GARDENSETUP = 'garden',
  LOCATION = 'location',
  USERDETAILS = 'user'
}

export enum CartOperation {
  ADD = 'add',
  REMOVE = 'remove',
  DELETE = 'delete'
}

export interface cartProductPriceAndQuantity {
  unit?: number,
  mass?: string | MassEnum,
  productId: string,
  quantity: number,
  soilMixQtyMass?: string,
  soilMixQtyUnit?: number,
  growBagName?: string,
  soilMixName?: string
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ items: [] });
  public purchaseProduct = {} as CartItem;
  public cartProducts: CartItem[] = [];
  constructor(private jsonHttpService: JsonHttpService) { }

  getLocalStorageValue(key: string) {
    const localStorageValue = localStorage.getItem(key);
    return localStorageValue ? JSON.parse(localStorageValue) : null;
  }

  async updateLocalStorage(key: string, data: any[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  async deleteLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  // showCartCount(key: string = localstorageEnum.PRODUCTS) {
  //   let isLocalStorageValue: any[] | null = this.getLocalStorageValue(key);

  //   if (!isLocalStorageValue) {
  //     return 0;
  //   }

  //   return isLocalStorageValue.length;
  // }

  // private findProductQuantity(items: any, item: any, key: string): number {
  //   let quantity = 0;

  //   const isProductInCart = (element: any) =>
  //     element.productId === item.productId &&
  //     element.unit === item.unit &&
  //     element.mass === item.mass;

  //   const isProductInGarden = (element: any) =>
  //     element.productId === item.productId &&
  //     element.soilMixQtyUnit === item.soilMixQtyUnit &&
  //     element.soilMixQtyMass === item.soilMixQtyMass;

  //   const checkCondition =
  //     key === localstorageEnum.PRODUCTS ? isProductInCart : isProductInGarden;

  //   items.forEach((element: any) => {
  //     if (checkCondition(element)) {
  //       quantity = element.quantity;
  //     }
  //   });
  //   return quantity;
  // }

  // eachProductCount(item: any, key: string = localstorageEnum.PRODUCTS): number {
  //   const items = this.getLocalStorageValue(key);
  //   if (!items) {
  //     return 0;
  //   }
  //   return this.findProductQuantity(items, item, key);
  // }

  // // eachProductCount1(item: CartItem) {
  // //   let isLocalStorageValue: string | null = this.getLocalStorageValue();

  // //   if (!isLocalStorageValue) {
  // //     return 0;
  // //   }

  // //   this.cartProducts = JSON.parse(isLocalStorageValue);
  // //   let quantity: number = 0;
  // //   this.cartProducts.forEach((element: CartItem) => {
  // //     if (element.productId == item.productId && element.unit == item.unit && element.mass == item.mass) {
  // //       quantity = element.quantity;
  // //     }
  // //   })
  // //   return quantity;
  // // }

  addCart(item: CartItem, doWhat: CartOperation, orderId: string): void {
    this.addToCart(item, doWhat, orderId);
  }

  addProductsToNewGArden(item: any, doWhat: CartOperation, orderId: string) {
    // this.addToGarden(item, doWhat, orderId);
  }
  

  private addToCart(
    item: CartItem,
    operation: CartOperation,
    key: string,
    isGardernItems: boolean = false,
  ) {
    const localStorageValue = this.getLocalStorageValue(key);

    if (localStorageValue !== null) {
      this.cartProducts = localStorageValue;
    }

    this.handleOperation(
      this.cartProducts,
      item,
      operation,
      key,
      isGardernItems,
      operation == CartOperation.ADD ? "Added to the cart" : "Removed from cart"
    );

    this.updateLocalStorage(key, this.cartProducts);
  }

  private handleOperation(
    items: any[],
    newItem: any,
    operation: CartOperation,
    key: string,
    isGardernItems: boolean,
    successMessage: string
  ) {
    let checker = false;

    const isProductInCart = (element: any) =>
      element.productId === newItem.productId &&
      element.unit === newItem.unit &&
      element.mass === newItem.mass;

    const isProductInGarden = (element: any) =>
      element.productId === newItem.productId &&
      element.soilMixQtyUnit === newItem.soilMixQtyUnit &&
      element.soilMixQtyMass === newItem.soilMixQtyMass;

    const checkCondition =
      !isGardernItems ? isProductInCart : isProductInGarden;

    items.forEach((element: any, i: number) => {
      if (checkCondition(element)) {
        checker = true;
        if (operation === CartOperation.ADD) {
          items[i].quantity++;
        } else if (operation === CartOperation.REMOVE) {
          if (items[i].quantity > 1) {
            items[i].quantity--;
          } else {
            items.splice(i, 1);
          }
        } else if (operation === CartOperation.DELETE) {
          items.splice(i, 1);
        }
      }
    });

    if (!checker) {
      items.push(newItem);
      // this.jsonHttpService.sendToastMessage("", successMessage, "success");
    }
  }

  showCartCount(key: string = localstorageEnum.PRODUCTS) {
    let isLocalStorageValue: any[] | null = this.getLocalStorageValue(key);

    if (!isLocalStorageValue) {
      return 0;
    }

    return isLocalStorageValue.length;
  }


  // private handleOperation(
  //   items: any[],
  //   newItem: any,
  //   operation: CartOperation,
  //   key: string,
  //   successMessage: string,
  //   enableNotification: boolean = true
  // ) {
  //   let checker = false;

  //   const isProductInCart = (element: any) =>
  //     element.productId === newItem.productId &&
  //     element.unit === newItem.unit &&
  //     element.mass === newItem.mass;

  //   const isProductInGarden = (element: any) =>
  //     element.productId === newItem.productId &&
  //     element.soilMixQtyUnit === newItem.soilMixQtyUnit &&
  //     element.soilMixQtyMass === newItem.soilMixQtyMass &&
  //     (element.growBagName ? (element.growBagName === newItem.growBagName)
  //       : (element.potName === newItem.potName));

  //   const checkCondition =
  //     key === localstorageEnum.PRODUCTS ? isProductInCart : isProductInGarden;

  //   items.forEach((element: any, i: number) => {
  //     if (checkCondition(element)) {
  //       checker = true;
  //       if (operation === CartOperation.ADD) {
  //         items[i].quantity++;
  //       } else if (operation === CartOperation.REMOVE) {
  //         if (items[i].quantity > 1) {
  //           items[i].quantity--;
  //         } else {
  //           items.splice(i, 1);
  //         }
  //       } else if (operation === CartOperation.DELETE) {
  //         items.splice(i, 1);
  //       }
  //     }
  //   });

  //   if (!checker) {
  //     items.push(newItem);
  //     enableNotification && this.jsonHttpService.sendToastMessage("", successMessage, "success");
  //   }
  // }


  // private addToGarden(
  //   item: GardenItem,
  //   operation: CartOperation,
  //   key: string
  // ) {
  //   const localStorageValue = this.getLocalStorageValue(key);

  //   if (localStorageValue !== null) {
  //     this.gardenSetup = localStorageValue;
  //   }

  //   this.handleOperation(
  //     this.gardenSetup,
  //     item,
  //     operation,
  //     key,
  //     "Added to the cart"
  //   );

  //   this.updateLocalStorage(localstorageEnum.GARDENSETUP, this.gardenSetup);
  // }

}
