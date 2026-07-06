import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';
export interface carouselModel {
  carouselId?: string;
  homeCarouselImageUrl?: string;
  homeCarouselImageUrlForMobile?: string;
  homeCarouselRedirectUrl?: string;
}

@Component({
  selector: 'app-home-carousel',
  templateUrl: './home-carousel.component.html',
  styleUrls: ['./home-carousel.component.css']
})
export class HomeCarouselComponent implements OnInit, OnDestroy {
  public imageChangedEvent: any = '';
  public carouselImages: carouselModel[] = [];
  singleCarouselImage = {} as carouselModel;
  public CarouselUploadingType: string = 'upload';
  private router_subscription: Subscription;
  constructor(private jsonHttpService: JsonHttpService, private actRoute: ActivatedRoute, private router: Router) {
    this.router_subscription = this.router.events.subscribe((event: any) => {

      if (event instanceof NavigationEnd) {
        this.CarouselUploadingType = this.actRoute.snapshot.params['type'];
        this.CarouselUploadingType == 'update' ? this.getBulkCarousel() : this.carouselImages = []
      }
    });
  }

  ngOnInit(): void {
    this.CarouselUploadingType = this.actRoute.snapshot.params['type'];
    this.CarouselUploadingType == 'update' && this.getBulkCarousel()
  }

  ngOnDestroy(): void {
    this.router_subscription.unsubscribe();
  }


  fileChangeEvent(event: any, isMobileImage: boolean = false): void {

    this.imageChangedEvent = event;
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event) => {


      if (isMobileImage)
        this.singleCarouselImage['homeCarouselImageUrlForMobile'] = event.target!['result'] as string;
      else
        this.singleCarouselImage['homeCarouselImageUrl'] = event.target!['result'] as string;
      this.singleCarouselImage['homeCarouselRedirectUrl'] = 'http://rkpattarai.com/';

    }
  }

  addImages() {
    if (!this.singleCarouselImage.homeCarouselImageUrl) {
      return this.jsonHttpService.sendToastMessage("", "Image Required", "failure");
    } else if (!this.singleCarouselImage.homeCarouselImageUrlForMobile) {
      return this.jsonHttpService.sendToastMessage("", "Image for Mobile is Required", "failure");
    }
    this.carouselImages.push(this.singleCarouselImage);
    this.singleCarouselImage = {};
  }

  imgPreviewLocal(url: string) {
    if (url.match(/^data:image\/[a-z]+;base64,/)) {
      return true;
    }
    else { return false; }
  }

  removeImage(index: number) {
    // if (this.carouselCountCheck() && (carouselId != undefined)) {
    //   this.deleteCarouselById(carouselId);
    // }
    this.carouselImages.splice(index, 1);
  }

  save(): void {


    // if(this.carouselCountCheck()){
    this.CarouselUploadingType == 'update' ? this.upDateCarouselImages() : this.uploadCarouselImages()
    // }

  }

  deleteCarouselById(carouselId: string) {

    if (this.carouselCountCheck()) {
      this.jsonHttpService.deleteCarouselById(carouselId).subscribe((data: any) => {
        this.jsonHttpService.sendToastMessage("", 'Images deleted successfully', "success");

      }, error => {
        this.jsonHttpService.sendToastMessage(error.message, "Images upload failed ", "failure");
      })
    }

  }

  getBulkCarousel() {
    this.jsonHttpService.FetchAllCarousel().subscribe((data: any) => {
      this.carouselImages = data.data;
    })
  }

  uploadCarouselImages() {


    this.jsonHttpService.creatBulkCarouselUpload(this.carouselImages).subscribe({
      next: (data: any) => {
        this.jsonHttpService.sendToastMessage("", 'Images uploaded successfully', "success");
      }, error: error => {
        this.jsonHttpService.sendToastMessage(error.message, "Images upload failed ", "failure");
      }
    })
  }

  upDateCarouselImages() {


    this.jsonHttpService.updateCarousel(this.carouselImages).subscribe({
      next: (data: any) => {
        this.jsonHttpService.sendToastMessage("", 'Images updated successfully', "success");

      }, error: error => {
        this.jsonHttpService.sendToastMessage(error.message, "Images update failed ", "failure");
      }
    })
  }

  carouselCountCheck() {
    // if(!(this.carouselImages.length >= 3 && this.carouselImages.length <= 6)){
    //   this.jsonHttpService.sendToastMessage("Minimun of 3 images ","Max 6 images allowed ","failure");
    //   return false
    // }
    return true
  }

  routePage(route: string) {
    this.router.navigate(['/' + route]);
  }

}
