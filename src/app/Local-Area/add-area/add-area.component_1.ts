import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { country } from 'src/app/Data/country';
import { areaModel } from 'src/app/Model/area';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';

@Component({
  selector: 'app-add-area',
  templateUrl: './add-area.component.html',
  styleUrls: ['./add-area.component.css']
})
export class AddAreaComponent implements OnInit, OnDestroy {
  public form1!: FormGroup;
  public submitted = false;
  public area = {} as areaModel;
  areaId: string = '';
  router_subscription: any;

  constructor(private formBuilder: FormBuilder,
    private jsonHttpService: JsonHttpService,
    private router: Router,
    private actRoute: ActivatedRoute) {

    this.router_subscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.areaId = this.actRoute.snapshot.params['areaId'];
      }
    });
  }

  ngOnDestroy(): void {
    this.router_subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.form1 = this.formBuilder.group({
      area: ['', Validators.required],
      pinCode: ['', Validators.required],
      areaId: [''],
    });

    if (this.areaId)
      this.getArea(this.areaId);
  }

  get areaCheck(): { [key: string]: AbstractControl } {
    return this.form1.controls;
  }
  proceed(): void {

    if (this.areaId)
      this.editArea()
    else
      this.addArea()

  }

  addArea() {
    this.jsonHttpService.AddNewArea(this.area).subscribe({
      next: (data: any) => {
        this.area = data.data[0]
        this.jsonHttpService.sendToastMessage("", 'Area added successfully', "success");
      }, error: error => {
        this.jsonHttpService.sendToastMessage("", error.error.statusText, "failure");
      }
    })
  }

  editArea() {
    this.jsonHttpService.editArea(this.area).subscribe({
      next: (data: any) => {
        this.area = data.data[0];
        this.jsonHttpService.sendToastMessage("", 'Area edited successfully', "success");
      }, error: error => {
        this.jsonHttpService.sendToastMessage("", error.error.statusText, "failure");
      }
    })
  }


  getArea(areaId: string) {
    this.jsonHttpService.getEditArea(areaId).subscribe({
      next: (data: any) => {
        this.area = data.data[0]
      }, error: error => {
        this.router.navigate(['/area'])
      }
    })
  }

}
