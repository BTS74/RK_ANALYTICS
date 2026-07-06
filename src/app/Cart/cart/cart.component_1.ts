import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem, CartOperation } from 'src/app/Model/cart.model';
import { CartType, MassEnum, productDetails, ProductNewGardenDetailsModel, products } from 'src/app/Model/products';
import { UserCartServiceService as cartService, localstorageEnum } from 'src/app/services/cart-service/user-cart-service.service';
import { ConfirmationService } from 'primeng/api';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';
import { ProductModel } from 'src/app/Data/cart';
import { addToCArt } from 'src/app/Product/single-product/single-product.component';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {

  cart: any = [];
  CartType = CartType;
  public imageSrc: string;
  public productsList: any = {};
  public orderId: string | null | undefined;
  public pageType: string = ''
  public orderPage: boolean = false;
  public showCartType: boolean[] = [true, false];
  localstorageEnum!: typeof localstorageEnum;
  unavailableProdIds: string[] = [];
  products: ProductModel[] = [];
  sidebarVisible1: boolean = false;
  newlyAdded: any[] = [];

  constructor(private jsonHttpService: JsonHttpService,
    private cartService: cartService,
    private router: Router,
    private confirmationService: ConfirmationService) {
    this.imageSrc = this.jsonHttpService.globalImgURL;
    this.localstorageEnum = localstorageEnum
  }

  ngOnInit(): void {
    if (this.showCartCountForHeader() > 0)
      this.fetchBasedOnCartCount();
  }

  fetchBasedOnCartCount() {
    this.getProductDetails();
    this.showCartType = [true, false];
  }


  getCartCount(key?: localstorageEnum | string) {
    switch (key) {
      case localstorageEnum.GARDENSETUP:
        return this.cartService.showCartCount(localstorageEnum.GARDENSETUP);
      case localstorageEnum.PRODUCTS:
        return this.cartService.showCartCount(localstorageEnum.PRODUCTS);
      default:
        return this.cartService.showCartCount() + this.cartService.showCartCount(localstorageEnum.GARDENSETUP);
    }
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

  showCartCountForHeader() {
    return this.cartService.showCartCount() + this.cartService.showCartCount(localstorageEnum.GARDENSETUP);
  }

  routeToProduct(prodId: string) {
    this.router.navigate(['/product/' + prodId])
  }

  onBlurMethod(productsList: any, whatToDo: string) {
    this.addRemoveProducts(productsList, whatToDo)
  }

  onBlurHandler(event: FocusEvent, product: products & productDetails & ProductNewGardenDetailsModel,): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.cartService.addCart({
      unit: product.unit,
      mass: product.mass,
      productId: product.productId,
      quantity: parseInt(inputValue) ?? 1
    }, "add" as CartOperation );
    this.getProductDetails();
  }

  addRemoveProducts(product: products & productDetails & ProductNewGardenDetailsModel,
    whatToDo: string, key: string = localstorageEnum.PRODUCTS) {
    if (key == localstorageEnum.PRODUCTS) {
      this.cartService.addCart({
        unit: product.unit,
        mass: product.mass,
        productId: product.productId,
        quantity: 1
      }, whatToDo as CartOperation);
      this.getProductDetails();
    } else {
      this.cartService.addProductsToNewGArden({
        soilMixQtyUnit: 20,
        soilMixQtyMass: MassEnum.Kg,
        productId: product.productId,
        quantity: 1,
        growBagName: "12*15 ( 200 GSM )",
        soilMixName: "Garden Potting Soil",
        potName: null
      }, whatToDo as CartOperation);
      this.getNewGardenProductDetails();
    }

  }



  showCartBtton(products: products & productDetails & ProductNewGardenDetailsModel, key: string = localstorageEnum.PRODUCTS) {
    return key == localstorageEnum.PRODUCTS ? this.cartService.eachProductCount({
      unit: products.unit,
      mass: products.mass,
      productId: products.productId,
      quantity: 1
    }, key) :

      this.cartService.eachProductCount({
        soilMixQtyUnit: products.soilMixQtyUnit,
        soilMixQtyMass: products.soilMixQtyMass,
        productId: products.productId,
        quantity: 1
      }, key)
  }




  confirm(): Promise<boolean> {
    return new Promise(resolve => {
      this.confirmationService.confirm({
        message: "Are you sure that you want to update cart?",
        header: "Confirmation",
        accept: () => {
          resolve(true);
        }
      })
    });
  }

  async removeProductsFromLocalStorage() {
    if (this.router.url.includes('new-garden-setup')) {
      this.router.navigate(['/check-out/new-garden-setup']);
      return;
    }

    if (this.checkForUnavailables()) {
      if (await this.confirm()) {
        await this.unavailableProductsRemove();
        this.getProductDetails(true);
      }
    }
    this.router.navigate(['/check-out']);
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
    purchaseProduct = this.cartService.getLocalStorageValue(localstorageEnum.PRODUCTS);
    purchaseProduct.forEach((product: CartItem) => {
      this.unavailableProdIds.forEach((productId: string) => {
        if (productId == product.productId) {
          this.cartService.addCart({
            unit: product.unit,
            mass: product.mass,
            productId: product.productId,
            quantity: 1
          }, CartOperation.REMOVE, false)
        }
      })
    })

  }

  getNewGardenProductDetails() {
    let prod: any = {};

    let isLocalStorageValue: string | null = localStorage.getItem(localstorageEnum.GARDENSETUP);
    if (isLocalStorageValue !== null) {
      prod['products'] = JSON.parse(isLocalStorageValue);

      let productsList: any = {};
      productsList['gardenCartModel'] = prod;

      this.jsonHttpService.FetchNewGardenCartProducts(productsList).subscribe({
        next: (data: any) => {
          this.cart = data.data;
        }, error: (error: any) => {
          this.cart = [];
        }
      });
    } else {
      this.cart = [];
    }
  }

  showCart(key: localstorageEnum) {
    this.cart = [];
    switch (key) {
      case localstorageEnum.PRODUCTS:
        this.showCartType = [true, false];
        this.getProductDetails();
        break;

      case localstorageEnum.GARDENSETUP:
        this.showCartType = [false, true];
        this.getNewGardenProductDetails();
        break;
    }

  }

  refreshProductList(event: addToCArt) {
    this.cartService.addCart({
      unit: event.unit,
      mass: event.mass,
      productId: event.productList.productId,
      quantity: 1
    }, event.whatToDo as CartOperation);
    this.getProductsFromLocalStorage();
  }

  getProductDetails(makeCartCall: boolean = false) {
    let prod: any = {};
    let isLocalStorageValue: string | null = localStorage.getItem(localstorageEnum.PRODUCTS);
    if (!isLocalStorageValue) {
      return
    }

    prod['products'] = JSON.parse(isLocalStorageValue);
    this.productsList['cartModel'] = prod;
    let fetchObservable;

    if (this.router.url.includes('new-garden-setup')) {
      fetchObservable = this.jsonHttpService.FetchNewGardenCartProductsAdmin(this.productsList);
    } else {
      fetchObservable = makeCartCall
        ? this.jsonHttpService.FetchCartProductsWithoutCharges(this.productsList)
        : this.jsonHttpService.FetchCartAvailabilityProducts(this.productsList);
    }
    

    fetchObservable.subscribe({
      next: (data: any) => {
        this.cart = data.data;
      },
      error: (error: any) => {
        this.cart = [];
        this.jsonHttpService.sendToastMessage('', error.error.statusText, "failure");
      }
    })

  }

  async getProductsFromLocalStorage() {
    let cart = await this.cartService.getLocalStorageValue(localstorageEnum.PRODUCTS);
    if (cart != null) {
      this.newlyAdded = cart;
      this.getProductDetails();
    }
  }


}
