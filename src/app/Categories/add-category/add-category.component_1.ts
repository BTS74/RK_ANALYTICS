import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';

import { category, subCategoryModel, SubDivisionModel } from 'src/app/Product/add-new-product/add-new-product.component';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';

type subCatDetails = {
  productSubCategoryName: string
  productSubCategoryImageForMobile: string
  productSubDivisionImageForMobile: string | any
  productSubDivisionName: string | any
  productCategory: string | any
}



@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit, OnDestroy {

  constructor(private jsonHttpService: JsonHttpService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.router_subscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.getPageInfo(event.url);
      }
    });
  }

  private router_subscription: Subscription;
  form1!: UntypedFormGroup;
  form2!: UntypedFormGroup;
  form3!: UntypedFormGroup;
  submitted: boolean[] = [false, false];
  public showForm: boolean[] = [true, false, false];
  public imageChangedEvent: string = '';
  public carouselImages: any = [];
  public category = {} as category
  public subCategory: any = {};
  subcategories: subCategoryModel[] = [];
  subDivisionModel = {} as SubDivisionModel;
  upDateCategory = {} as category

  AllCategories: category[] = [];

  public subCatList: subCatDetails[] = [];
  subDivisionList: any = {}


  ngOnDestroy(): void {
    this.router_subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.form1 = this.formBuilder.group({

      productCategory: ['', Validators.required],
      productCategoryImage: [''],
      productCategoryBanner: [''],
      onlyForChennaiCustomer: ['']
    });

    this.form2 = this.formBuilder.group({
      productCategory: ['', Validators.required],
      productSubCategoryName: [''],
    });

    this.form3 = this.formBuilder.group({
      productCategory: [''],
      productSubCategoryName: [''],
      productSubDivisionName: [''],
      productSubDivisionImageForMobile: ['']
    });

  }

  get quantityCheck(): { [key: string]: AbstractControl } {
    return this.form1.controls;
  }

  get subcategoryCheck(): { [key: string]: AbstractControl } {
    return this.form2.controls;
  }

  get subDivisionCheck(): { [key: string]: AbstractControl } {
    return this.form3.controls;
  }

  fileChangeEvent(event: any, imageType: string, type?: string): void {

    this.imageChangedEvent = event;
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event) => {

      if (!type) {
        if (imageType == 'Banner') {
          this.category.productCategoryBanner = event.target!['result'];
        } else if (imageType == 'Image') {
          this.category.productCategoryImage = event.target!['result'];
        } else if (imageType == 'mobileImage') {
          this.subCategory.productSubCategoryImageForMobile = event.target!['result'];
        }
      }

      else if (type == 'subdivision') {
        this.subCategory.productSubDivisionImageForMobile = event.target!['result'];
      }

    }
  }

  imgPreviewLocal(url: string) {
    if (url.match(/^data:image\/[a-z]+;base64,/)) {
      return true;
    }
    else { return false; }
  }

  removeImage(imageType: string) {

    if (imageType == 'Banner') {
      this.category.productCategoryBanner = '';
    } else if (imageType == 'Image') {
      this.category.productCategoryImage = '';
    } else if (imageType == 'mobileImage') {
      this.subCategory.productSubCategoryImageForMobile = '';
    }

  }

  getProductCaegoryAndSubCat() {
    this.jsonHttpService.FetchAllCategories().subscribe((data: any) => {
      this.AllCategories = data.data[0]
    })
  }

  save(whatToDo?: string): void {
    if (whatToDo) {
      this.showForm[0] ? this.category = {} : (this.subCategory = [], this.subCatList = [])
      return;
    }

    if (this.showForm[0]) {
      return this.saveOperation0()
    } else if (this.showForm[1]) {
      return this.saveOperation1()
    } else if (this.showForm[2]) {
      return this.saveOperation2()
    } else if (this.showForm[3]) {
      return this.saveOperation3()
    }
  }
  saveOperation0() {
    this.submitted[0] = true;

    if (this.form1.invalid) {
      return;
    }

    this.jsonHttpService.createNewCategory(this.category).subscribe({
      next: (data: any) => {
        this.submitted[0] = false;
        this.category = {} as category;
        this.jsonHttpService.sendToastMessage("Category", 'created successfully', "success");
      }, error: error => {
        this.jsonHttpService.sendToastMessage('There is an error', error.error.statusText, "failure");
      }
    })
  }

  saveOperation1() {
    this.submitted[1] = true;
    if (this.form2.invalid) {
      return
    }

    let addsubCat: any = {};
    addsubCat['productCategory'] = this.subCategory.productCategory;
    addsubCat['productSubCategoryDetails'] = this.subCatList;

    this.jsonHttpService.createNewSubCategory(addsubCat).subscribe({
      next: (data: any) => {
        this.jsonHttpService.sendToastMessage("Sub category", 'created successfully', "success");
      }, error: error => {
        this.jsonHttpService.sendToastMessage('There is an error', error.error.statusText, "failure");
      }
    })
  }

  saveOperation2() {
    this.submitted[0] = true;

    if (this.form1.invalid) {
      return;
    }

    this.jsonHttpService.updateCategory(this.category).subscribe({
      next: (data: any) => {
        this.submitted[0] = false;
        this.category = {};
        this.jsonHttpService.sendToastMessage("Category", 'updated successfully', "success");
      }, error: error => {
        this.jsonHttpService.sendToastMessage('There is an error', error.error.statusText, "failure");
      }
    })
  }

  saveOperation3() {
    this.submitted[3] = true;
    if (this.form3.invalid) {
      return;
    }

    let sucDivison: any = [];
  
    this.subCatList.forEach((e: any) => {     
      sucDivison.push({
        productSubDivisionName: e.productSubDivisionName,
        productSubDivisionImageForMobile:e.productSubDivisionImageForMobile});
    })

    this.category.productCategory = this.subCatList[0].productCategory;
    this.category.productSubCategoryDetails = [{ productSubCategoryName: this.subCatList[0].productSubCategoryName }];
    this.category.productSubCategoryDetails[0].productSubDivisionDetails = sucDivison;


    this.jsonHttpService.updateSubCategory(this.category).subscribe({
      next: (data: any) => {
        this.submitted[3] = false;
        this.category = {};
        this.jsonHttpService.sendToastMessage("", 'updated successfully', "success");
      }, error: error => {
        this.jsonHttpService.sendToastMessage('', error.error.statusText, "failure");
      }
    })
  }


  addSubCategories(data: subCatDetails) {
    if (this.subCategory.productSubCategoryName == '' || this.subCategory.productSubCategoryName == undefined) {
      return this.jsonHttpService.sendToastMessage('', "Add subcategory name", "failure");

    } else if (!this.subCategory.productSubCategoryImageForMobile) {
      return this.jsonHttpService.sendToastMessage('', "Add subcategory image", "failure");
    }
    let sucCatName: any = {};
    sucCatName['productSubCategoryName'] = data.productSubCategoryName;
    sucCatName['productSubCategoryImageForMobile'] = data.productSubCategoryImageForMobile;


    let subcatCheck = false;
    this.subCatList.filter((e: any) => {
      if (e.productSubCategoryName == data) {
        subcatCheck = true;
      }
    })

    if (!subcatCheck) {
      this.subCatList.push(sucCatName)

      this.subCategory = {
        productSubCategoryName: "",
      };
    }
  }

  addSubDivison() {
    if (this.subCategory.productSubCategoryName == '' || this.subCategory.productSubCategoryName == undefined) {
      return this.jsonHttpService.sendToastMessage('', "Add subcategory name", "failure");

    } else if (!this.subCategory.productSubDivisionImageForMobile) {
      return this.jsonHttpService.sendToastMessage('', "Add subcategory image", "failure");
    }
    let sucCatName: any = {};

    sucCatName['productSubCategoryName'] = this.subCategory.productSubCategoryName;
    sucCatName['productSubDivisionImageForMobile'] = this.subCategory.productSubDivisionImageForMobile;
    sucCatName.productSubDivisionName = this.subCategory.productSubDivisionName;
    sucCatName.productCategory = this.subCategory.productCategory;


    let subcatCheck = false;
    this.subCatList.filter((e: any) => {
      if (e.productSubCategoryName != this.subCategory.productSubCategoryName ||
        e.productCategory != this.subCategory.productCategory || e.productSubDivisionName == this.subCategory.productSubDivisionName) {
        subcatCheck = true;
      }
    })

    if (!subcatCheck || this.subCatList.length == 0) {
      this.subCatList.push(sucCatName)
      this.subCategory = {
        productSubDivisionName: "",
        productSubDivisionImageForMobile: ""
      };
    } else {
      this.jsonHttpService.sendToastMessage('', "select same category / subcategory or same name used for sub division ", "failure");
    }
  }

  getPageInfo(location: string) {

    switch (location) {
      case '/add-category':
        this.showForm = [true, false, false]
        break;

      case '/add-subcategory':
        this.showForm = [false, true, false];
        break;

      case '/update-category':
        this.showForm = [false, false, true];
        break;

      case '/add-subdivision':
        this.showForm = [false, false, false, true];
        break;
    }

    this.getProductCaegoryAndSubCat();

  }

  routeTo(location: string) {
    this.router.navigate(['/' + location])
  }

  removePriceAndQuantity(index: number) {
    this.subCatList.splice(index, 1)
  }

  selectedCategory(event: any) {
    this.AllCategories.forEach((value, index: number) => {
      if (value.productCategory == event) {
        this.category = this.AllCategories[index];
      }

    })
  }

  chooseCategory(selectedCaetegory: string) {

    this.AllCategories.forEach((data: category) => {
      if (data.productCategory === selectedCaetegory)
        this.subcategories = data.productSubCategoryDetails
    })
  }

  isChennaiDelivery(areaType: any) {
    this.category.onlyForChennaiCustomer = this.covertStringtoGetBoolean(areaType.value);
  }

  covertStringtoGetBoolean(value: string | boolean | number) {
    switch (value) {
      case true:
      case "true":
      case 1:
      case "1":
      case "on":
      case "yes":
        return true;
      default:
        return false;
    }
  }
}
