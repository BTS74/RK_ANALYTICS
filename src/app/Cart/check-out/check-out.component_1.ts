import { ChangeDetectorRef, Component, OnInit, AfterViewInit, OnDestroy, HostListener, Input, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmationService } from 'primeng/api';

import { checkout, addressBaseComponent, parcelServiceProvider, hubDetails, hub } from 'src/app/Data/interface';
import { Subject, Subscription } from 'rxjs';
import { CartProductModel, CartType, products } from 'src/app/Model/products';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';
import { CartService, localstorageEnum } from 'src/app/services/cart-service/cart.service';


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
  id: number;
  isSelected: boolean;

}

enum parcelProvide {
  MSS = 'Mettur Super Service',
  RATHIMEENA = 'Rathi Meena',
  KPN = 'KPN'
}

export interface ParcelProviders {
  parcelServiceProvider: string
}

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit, AfterViewInit, OnDestroy {

  public form1!: FormGroup;
  public productsList: any = {};
  public countryCode: string = 'IN';
  public fetchAreaDetails: any = [];

  public finalCheckOut = {} as checkout;
  public submitted = [false, false];
  public proceedBtn: boolean = true;
  public showParcelServiceOption: boolean = false;
  public address = { country: "India" } as addressBaseComponent;
  cart: any = [];
  newGardenCart: any = [];
  isNewGardenSetup: boolean = false;
  enum: typeof parcelProvide = parcelProvide;
  parcelServiceProvider: string = '';
  locationDetails: parcelModel[] = [];
  selectedHubDetails = {} as hubDetails
  hubDetails: hubDetails[] = [];
  visible: boolean = false;
  currentUrl: string = "";
  router_subscription: Subscription;
  uniqueDistricts: string[] = [];
  providersList: ParcelProviders[] = [];
  orderUpdatePage: boolean = false;
  @Input() userInfo = {} as checkout;
  @Input() OrderData: any = [];
  @Output() updateParcelServiceProvider = new EventEmitter();
  selectedService: string = '';
  imageSrc: string = '';
  public openModalParcelService: Subject<void> = new Subject<void>();

  constructor(private jsonHttpService: JsonHttpService, private cookieService: CookieService,
    private formBuilder: FormBuilder, private router: Router, private cartService: CartService,
    private cdr: ChangeDetectorRef, private confirmationService: ConfirmationService) {
    this.router_subscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });

    this.imageSrc = this.jsonHttpService.globalImgURL

  }

  ngOnDestroy(): void {
    this.router_subscription.unsubscribe();
  }


  ngOnInit(): void {
    this.getProductCall(this.currentUrl);
    if (this.currentUrl.includes('/order-update'))
      this.orderUpdatePage = true;

    this.form1 = this.formBuilder.group({
      pinCode: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      state: ['', Validators.required],
      city: ['', Validators.required],
      // country: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      alternativePhone: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      // district: ['', Validators.required],
      addressLine1: ['', Validators.required],
      gstIn: [null, [Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}"
        + "[A-Z]{1}[1-9A-Z]{1}"
        + "Z[0-9A-Z]{1}$")
      ]]
    });


  }

  ngAfterViewInit(): void {
    if (!this.orderUpdatePage) {
      this.checkCookieStoredAddress();
      this.getAreaDetails();
    } else {
      this.finalCheckOut = this.userInfo;
      this.address = this.userInfo.address;
      this.showParcelServiceOption = !this.OrderData[0].isChennaiLocation && this.OrderData[0].isParcelService
      if (this.showParcelServiceOption) {
        this.getProviders();
      }
      this.cart = this.OrderData;
      this.selectedService = this.cart[0].parcelServiceProviderName
    }


    this.cdr.detectChanges();
  }


  getProductCall(route: string) {
    switch (route) {
      case "/check-out/garden-setup":
        this.isNewGardenSetup = true;
        this.getNewGardenProductDetails();
        break;
      case "/check-out":
      case "/check-out/new-garden-setup":
        this.isNewGardenSetup = false;
        this.getProductDetails();
        break;
    }
  }

  get addressCheck(): { [key: string]: AbstractControl } {
    return this.form1.controls;
  }

  getProductDetails() {
    let prod: any = {};
    let isLocalStorageValue: any[] | null = this.cartService.getLocalStorageValue(localstorageEnum.PRODUCTS);
    if (isLocalStorageValue !== null) {
      prod['products'] = isLocalStorageValue;
      this.productsList['cartModel'] = prod;
      this.router.url.includes('new-garden-setup') ? this.getAdminNewGardenCartProducts() : this.getCartProducts()
    } else {
      this.router.navigate(['/home']);
    }
  }

  getNewGardenProductDetails() {
    let prod: any = {};
    let isLocalStorageValue: any[] | null = this.cartService.getLocalStorageValue(localstorageEnum.GARDENSETUP);

    if (isLocalStorageValue !== null) {
      prod['products'] = isLocalStorageValue;
      let productsList: any = {};
      productsList['gardenCartModel'] = prod;

      this.jsonHttpService.FetchNewGardenCartProducts(productsList).subscribe({
        next: (data: any) => {
          this.cart = data.data;
        }, error: (error: any) => {
          this.router.navigate(['/home']);
          this.cart = [];
        }
      })
    } else {
      this.cart = [];
    }
  }
  getProviders() {
    this.jsonHttpService.FetchParcelServiceProviderList().subscribe({
      next: (data: any) => {
        this.providersList = data.data[0];
      }, error: error => {
        this.providersList = []
      }
    })
  }

  getCartProducts() {
    this.jsonHttpService.FetchCartProductsWithoutCharges(this.productsList).subscribe({
      next: (data: any) => {
        this.cart = data.data;
      }, error: error => {
        this.router.navigate(['/home']);
        this.cart = [];
      }
    })
  }

  getAdminNewGardenCartProducts() {
    this.jsonHttpService.FetchNewGardenCartProductsAdmin(this.productsList).subscribe({
      next: (data: any) => {
        this.cart = data.data;
      }, error: error => {
        this.router.navigate(['/home']);
        this.cart = [];
      }
    })
  }

  checkCookieStoredAddress() {
    let isLocalStorageValue = this.cartService.getLocalStorageValue(localstorageEnum.USERDETAILS);
    if (isLocalStorageValue) {
      this.address = isLocalStorageValue.address
      this.finalCheckOut = isLocalStorageValue;
    }
  }


  // to calculate deliveryCharge
  proceedOrder() {
    this.submitted[1] = true;
    if (this.form1.invalid) {
      return;
    }
    let prod: any = {};
    if (this.form1.value.gstIn === "")
      delete this.finalCheckOut.gstIn;
    this.productsList['user'] = this.finalCheckOut;
    this.address.addressLine2 = this.address.addressLine1;
    this.finalCheckOut['address'] = this.address;
    this.productsList['deliveryInstruction'] = 'none';
    this.cookieService.delete('___use__');
    const userDetails = JSON.stringify(this.finalCheckOut);
    this.cookieService.set("___use__", userDetails);
    this.cookieService.set('phoneNo', JSON.stringify(this.finalCheckOut.phone));

    let isLocalStorageValue: any[] | null = this.isNewGardenSetup ?
      this.cartService.getLocalStorageValue(localstorageEnum.GARDENSETUP) :
      this.cartService.getLocalStorageValue(localstorageEnum.PRODUCTS);

    if (this.isNewGardenSetup) {
      this.productsList['gardenCartModel'] = prod;
      if (!isLocalStorageValue) {
        return;
      }
      prod['products'] = isLocalStorageValue;
      return this.fetchGarden();

    } else {
      this.productsList['cartModel'] = prod;
      let isLocalStorageValue: any[] | null = this.cartService.getLocalStorageValue(localstorageEnum.PRODUCTS);
      if (!isLocalStorageValue) { return };
      prod['products'] = isLocalStorageValue;
      this.fetchCart(this.productsList)
    }
  }

  fetchGarden() {
    this.jsonHttpService.FetchNewGardenCartProducts(this.productsList).subscribe({
      next: (data: any) => {
        this.cart = data.data;
        this.proceedBtn = false;
      },
      error: (error: any) => {
        this.jsonHttpService.sendToastMessage(error.error.statusText, '', "failure");
        this.cart = error.error.data;
      }
    })
  }

  fetchCart(productsList: any) {

    const fetchObservable = this.router.url.includes('new-garden-setup') ? this.jsonHttpService.FetchNewGardenCartProductsAdmin(this.productsList) :
    
    this.jsonHttpService.FetchCartProductsWithoutCharges(productsList)

    fetchObservable.subscribe({
      next: (data: any) => {
        this.cart = data.data;
        this.showParcelServiceOption = !data.data[0].isChennaiLocation && data.data[0].isParcelService
        if (this.showParcelServiceOption)
          this.getProviders();
        this.proceedBtn = false;
      }, error: (error: any) => {
        if (error.error?.statusText.includes("Place")) {
          this.confirm(error.error);
        } else {
          this.jsonHttpService.sendToastMessage(error.error?.statusText ? error.error?.statusText : "We're Facing some issues", '', "failure");
        }
        this.proceedBtn = true;
      }
    })

  }
  alterMobileNumber(event: KeyboardEvent) {
    let inputValue = event.key;
    if (/[0-9]/.test(inputValue)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  // alterMobileNumber(event: KeyboardEvent) {
  //   // Get the input value as a string
  //   let inputValue = event.key;

  //   // Check if the input value is a digit and if the total number of digits is less than 10
  //   if (/[0-9]/.test(inputValue) && this.getNumberOfDigitsAlter() < 10) {
  //     // Allow the input     
  //     return true;
  //   }

  //   // Prevent default behavior (i.e typing the character)
  //   event.preventDefault();
  //   return false;
  // }

  //   // Function to count the number of digits in the input
  //   getNumberOfDigitsAlter() {
  //     // Get the value of the input element
  //     let inputValue = this.finalCheckOut.alternativePhone; /* Get the input value */;

  //     // Remove spaces from the input value and count the number of digits
  //     let numberOfDigits = inputValue.replace(/\s/g, '').replace(/\D/g, '').length;
  //     return numberOfDigits;
  //   }


  mobileNumber(event: Event) {
    // Get the input value as a string
    let inputValue = (event.target as HTMLInputElement).value;

    // Remove any non-numeric characters
    let numericValue = inputValue.replace(/\D/g, '');

    // Check if the input value is a digit and if the total number of digits is less than 10
    if (numericValue.length > 10) {
      // Trim the input value to 10 digits
      numericValue = numericValue.slice(0, 10);
    }

    // Update the input field value with the sanitized value
    (event.target as HTMLInputElement).value = numericValue;

    // Update the model value with the sanitized value
    this.finalCheckOut.phone = numericValue;


    if (this.getNumberOfDigits() == 10) {
      this.getUserDetails();
    }

    // Prevent default behavior (i.e typing the character)
    event.preventDefault();

  }


  // Function to count the number of digits in the input
  getNumberOfDigits() {
    // Get the value of the input element
    let inputValue = this.finalCheckOut.phone; /* Get the input value */;

    // Remove spaces from the input value and count the number of digits
    let numberOfDigits = inputValue.replace(/\s/g, '').replace(/\D/g, '').length;
    return numberOfDigits;
  }

  optionsChange(event: any) {
  }

  confirm(data: any) {

    this.confirmationService.confirm({
      message: "Please " + data.statusText + " <br>" + (data?.statusTextInTamil ? data?.statusTextInTamil : ""),
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
      },
    });
  }

  getAreaDetails() {
    this.jsonHttpService.FetchStateCityCall(this.address.pinCode, this.countryCode).subscribe((data: any) => {
      this.fetchAreaDetails = data;
      this.finalCheckOut['email'] = 'rkpattarai@gmail.com';
      this.address.state = this.fetchAreaDetails.result[0]?.state;
      this.address.city = this.fetchAreaDetails.result[0]?.province;
      this.proceedBtn = true;
      this.showParcelServiceOption = false;
    })
  }

  getAreaDetailKeyUp() {
    if (this.address.pinCode!.toString().length >= 6) {
      this.getAreaDetails();
    }
  }
  closeConfirmation(type: string) {
    this.visible = false;
    if (type == 'order') {
      this.router.navigate(['/order/All'], { queryParams: { page: 0 } });
    } else {
      this.router.navigate(['cart'])
    }

  }

  async placeOrder() {


    this.submitted[1] = true;
    if (this.form1.invalid) {
      this.jsonHttpService.sendToastMessage('Please Fill the forms', "", "failure");
      return;
    }
    if (this.cart[0].isParcelService && !this.cart[0].isChennaiLocation) {
      if (!this.selectedHubDetails.isSelected || !this.selectedHubDetails.hubAddress || !this.selectedHubDetails.hubLocation) {
        this.jsonHttpService.sendToastMessage('Please select proper Hub location', "", "failure");
        return
      }
    }


    let createOrder: any = {};
    let products: any = {};
    this.address.addressLine2 = this.address.addressLine1;
    this.finalCheckOut['address'] = this.address;
    this.finalCheckOut['email'] = 'rkpattarai@gmail.com';


    createOrder['user'] = this.finalCheckOut
    createOrder['deliveryInstruction'] = 'none'
    createOrder['parcelServiceProviderName'] = this.parcelServiceProvider;
    createOrder['parcelServiceHubName'] = this.selectedHubDetails.hubLocation;
    createOrder['parcelServiceHubAddress'] = this.selectedHubDetails.hubAddress;
    createOrder['parcelLocationId'] = this.selectedHubDetails.locationId;
    createOrder["redirectURI"] = JsonHttpService.websiteLink + "find-orders";

    if (this.isNewGardenSetup) {
      products['products'] = this.cart[0].gardenCartModel.products;
      createOrder['gardenCartModel'] = products;
      localStorage.removeItem(localstorageEnum.GARDENSETUP);
      this.jsonHttpService.creatGardenOrder(createOrder).subscribe({
        next: () => {
          this.visible = true;
        },
        error: (error: any) => {
          this.jsonHttpService.sendToastMessage('', error.error.statusText, "failure");
        }
      })
      return;
    } else {

      products['products'] = this.cart[0].cartModel.products;
      createOrder['cartModel'] = products;
      await this.removeProductsFromLocalStorage();

      const fetchObservable = this.router.url.includes('new-garden-setup') ? this.jsonHttpService.FetchNewGardenCreateAdmin(createOrder) 
      :this.jsonHttpService.createProductOrder(createOrder);

      fetchObservable.subscribe({
          next: (data: any) => {
            this.visible = true;
          },
          error: (error) => {
            this.jsonHttpService.sendToastMessage('There is an error', error.error.statusText, "failure");
          }
        })
    }
  }

  async removeProductsFromLocalStorage() {
    localStorage.removeItem(localstorageEnum.PRODUCTS);
  }

  closeTransportationModal() {
    this.router.navigate(['/find-orders']);
    this.cookieService.delete('products', '/');
    this.visible = false;
  }



  getHubLocation(serviceProvider: string) {
    this.uniqueDistricts = [];
    this.hubDetails = [];
    /*
    this is to convert pondicherry into Tamil Nadu state divison
    */
    this.address.state = (this.address.state === 'Pondicherry' || this.address.state === 'Puducherry') ? "Tamil Nadu" : this.address.state;
    this.jsonHttpService.FetchHubLocationByParcelServiceProviderAndStateAndPlants(serviceProvider, this.address.state!,
      this.orderUpdatePage ? this.OrderData[0].cartModel.isPlantsOnly : this.cart[0].cartModel.isPlantsOnly).subscribe({
        next: (data: any) => {
          this.locationDetails = data.data[0];
          this.locationDetails.forEach((data, index) => {
            data.isSelected = false;
            data.id = index

            if (data?.district && !this.uniqueDistricts.includes(data?.district?.toLowerCase())) {
              this.uniqueDistricts.push(data?.district?.toLowerCase());
            }
          })

          // this.hubDetails = this.locationDetails.parcelServiceDetails;
          this.onChange();
          // document.getElementById('parcelHubList')?.click();
          this.openModalParcelService.next();
        }, error: (error: any) => {
          this.jsonHttpService.sendToastMessage(error.error.statusText, '', "failure");
        }
      })

  }

  isHubSelected(item: hubDetails) {
    this.selectedHubDetails = item
    this.locationDetails.forEach((val: hubDetails) => {
      if (val.id == item.id) val.isSelected = !val.isSelected;
      else {
        val.isSelected = false;
      }
    });
    this.updateParcelServiceProvider.emit({ hubDetails: this.selectedHubDetails, provider: this.parcelServiceProvider });
  }

  whichServiceProvider(provider: string) {
    this.parcelServiceProvider = provider;
    this.selectedHubDetails = {} as hubDetails;
    this.getHubLocation(provider);
  }

  isHubselected() {
    if (this.selectedHubDetails.isSelected == false) {
      this.jsonHttpService.sendToastMessage('Please select Hub', "", "failure");
    } else {
      // document.getElementById('parcelHubList')?.click();
      this.openModalParcelService.next();
    }
  }

  onChange(event?: any) {
    let defaultDistrict = '';
    if (!event) {
      defaultDistrict = this.locationDetails[0].district ? this.locationDetails[0].district.toLowerCase() : "";
    } else {
      defaultDistrict = event.target.value.toLowerCase();
    }

    this.hubDetails = this.locationDetails.filter((hub: hubDetails) => {
      return hub?.district ? (hub?.district.toLowerCase() == defaultDistrict) : true
    });
  }


  search(search: string) {
    // if (!search.trim()) {
    //   this.locationDetails.parcelServiceDetails = this.hubDetails;
    //   return;
    // }
    // this.locationDetails.parcelServiceDetails = this.hubDetails;

    // this.locationDetails.parcelServiceDetails = this.locationDetailsByState.parcelServiceDetails.filter((location: any) =>
    //   location?.hubLocation.toLowerCase().startsWith(search.toLowerCase()) || location?.hubLocation.toLowerCase().includes(search.toLowerCase()));

  }


  getUserDetails() {
    const isLocalStorageValue = this.cartService.getLocalStorageValue(localstorageEnum.USERDETAILS);
    let phone;
    if (!isLocalStorageValue) {
      this.fetchUserAddress(this.finalCheckOut.phone);
    } else {
      if (isLocalStorageValue.phone != this.finalCheckOut.phone) {
        phone = this.finalCheckOut.phone;
        this.finalCheckOut = {};
        this.finalCheckOut.phone = phone;
        localStorage.removeItem(localstorageEnum.USERDETAILS);
        this.getUserDetails();
      }
    }
  }

  fetchUserAddress(phone: number) {
    this.jsonHttpService.FetchUserAddress(phone).subscribe({
      next: (data: any) => {
        const userDetails = data.data[0];
        // Remove null properties from userDetails
        let filteredUserDetails: any = {};
        for (const key in userDetails) {
          if (userDetails.hasOwnProperty(key) && userDetails[key] !== null) {
            filteredUserDetails[key] = userDetails[key];
          }
        }

        // Set finalCheckOut and address
        this.finalCheckOut = filteredUserDetails;
        this.address = filteredUserDetails.address!;

        // Save filtered userDetails to localStorage
        localStorage.setItem(localstorageEnum.USERDETAILS, JSON.stringify(filteredUserDetails));


      },
      error: () => {
        // Handle error
      }
    });
  }

  checkAbs() {
    if (this.isNewGardenSetup) {
      return false;
    }

    let containsAbs = this.cart[0]?.cartModel?.products.some((cart: CartProductModel) =>
      cart.productModel.productCategory == 'ABS Stands');
    return containsAbs;
  }

  checkDrainCells() {
    if (this.isNewGardenSetup)
      return false;


    return this.cart[0]?.cartModel?.products.some((cart: CartProductModel) =>
      cart.productModel.productNameInEnglish === "Drain Mats"
    ) ?? false;

  }

  checkForABS() {
    if (this.isNewGardenSetup)
      return false;

    return this.cart[0]?.cartModel?.products.some((cart: CartProductModel) =>
      cart.productModel.productCategory.includes("ABS Stands") || cart.productModel.productCategory.includes("Stands")
    ) ?? false;
  }


}
