import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Cart, CartItem, CartOperation, GardenItem } from 'src/app/Model/cart.model';
import { MassEnum } from 'src/app/Model/products';
import { JsonHttpService } from '../Json-Http/json-http.service';

export enum localstorageEnum {
  PRODUCTS = 'products',
  GARDENSETUP = 'garden',
  LOCATION = 'location',
  USERDETAILS = 'user'
}

interface Item {
  productId: string;
  unit?: string | number;
  mass?: MassEnum;
  soilMixQtyUnit?: string | number;
  soilMixQtyMass?: MassEnum;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserCartServiceService {
  cart = new BehaviorSubject<Cart>({ items: [] });
  public purchaseProduct = {} as CartItem;
  public cartProducts: CartItem[] = [];
  public gardenSetup: GardenItem[] = [];
  constructor(private jsonHttpService: JsonHttpService) { }

  getLocalStorageValue(key: string) {
    const localStorageValue = localStorage.getItem(key);
    return localStorageValue ? JSON.parse(localStorageValue) : null;
  }

  updateLocalStorage(key: string, data: any[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  setLocalStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  removeLocalStorage(key?: string) {
    key ? localStorage.removeItem(key) : localStorage.clear();
  }

  showCartCount(key: string = localstorageEnum.PRODUCTS) {
    let isLocalStorageValue: any[] | null = this.getLocalStorageValue(key);

    if (!isLocalStorageValue) {
      return 0;
    }

    return isLocalStorageValue.length;
  }

  private findProductQuantity(items: any, item: any, key: string): number {
    let quantity = 0;

    const isProductInCart = (element: any) =>
      element.productId === item.productId &&
      element.unit === item.unit &&
      element.mass === item.mass;

    const isProductInGarden = (element: any) =>
      element.productId === item.productId &&
      element.soilMixQtyUnit === item.soilMixQtyUnit &&
      element.soilMixQtyMass === item.soilMixQtyMass;

    const checkCondition =
      key === localstorageEnum.PRODUCTS ? isProductInCart : isProductInGarden;

    items.forEach((element: any) => {
      if (checkCondition(element)) {
        quantity = element.quantity;
      }
    });
    return quantity;
  }

  eachProductCount(item: any, key: string = localstorageEnum.PRODUCTS): number {
    const items = this.getLocalStorageValue(key);
    if (!items) {
      return 0;
    }
    return this.findProductQuantity(items, item, key);
  }

  addCart(item: CartItem, doWhat: CartOperation, enableNotification: boolean = true): void {
    this.addToCart(item, doWhat, localstorageEnum.PRODUCTS, enableNotification);
  }

  addProductsToNewGArden(item: GardenItem, doWhat: CartOperation) {
    this.addToGarden(item, doWhat, localstorageEnum.GARDENSETUP);
  }

  private addToCart(
    item: CartItem,
    operation: CartOperation,
    key: string, enableNotification: boolean
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
      "Added to the cart",
      enableNotification
    );

    this.updateLocalStorage(localstorageEnum.PRODUCTS, this.cartProducts);
  }

  private handleOperation(
    items: any[],
    newItem: any,
    operation: CartOperation,
    key: string,
    successMessage: string,
    enableNotification: boolean = true
  ) {
    let checker = false;

    const isProductInCart = (element: any) =>
      element.productId === newItem.productId &&
      element.unit === newItem.unit &&
      element.mass === newItem.mass;

    const isProductInGarden = (element: any) =>
      element.productId === newItem.productId &&
      element.soilMixQtyUnit === newItem.soilMixQtyUnit &&
      element.soilMixQtyMass === newItem.soilMixQtyMass &&
      (element.growBagName ? (element.growBagName === newItem.growBagName)
        : (element.potName === newItem.potName));

    const checkCondition =
      key === localstorageEnum.PRODUCTS ? isProductInCart : isProductInGarden;

    items.forEach((element: any, i: number) => {
      if (checkCondition(element)) {
        checker = true;
        if (operation === CartOperation.ADD) {
          if (typeof newItem.quantity === 'number' && !isNaN(newItem.quantity) && newItem.quantity > 1) {
            items[i].quantity = newItem.quantity;
          } else {
            items[i].quantity++;
          }
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
      enableNotification && this.jsonHttpService.sendToastMessage("", successMessage, "success");
    }
  }



  private addToGarden(
    item: GardenItem,
    operation: CartOperation,
    key: string
  ) {
    const localStorageValue = this.getLocalStorageValue(key);

    if (localStorageValue !== null) {
      this.gardenSetup = localStorageValue;
    }

    this.handleOperation(
      this.gardenSetup,
      item,
      operation,
      key,
      "Added to the cart"
    );

    this.updateLocalStorage(localstorageEnum.GARDENSETUP, this.gardenSetup);
  }


}
