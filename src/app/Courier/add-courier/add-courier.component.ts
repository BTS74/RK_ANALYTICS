import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { JsonHttpService } from 'src/app/services/Json-Http/json-http.service';
import { Courier } from '../all-courier/all-courier.component';

@Component({
  selector: 'app-add-courier',
  templateUrl: './add-courier.component.html',
  styleUrls: ['./add-courier.component.css']
})
export class AddCourierComponent implements OnInit, OnDestroy {
  refreshEvent: Subject<void> = new Subject<void>();
  router_subscription: Subscription;

  public courierForm!: FormGroup;
  public submitted = false;
  courierModel = {} as Courier;
  editWizard: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private jsonHttpService: JsonHttpService,
    private router: Router,
    private actRoute: ActivatedRoute) {

    this.router_subscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('/edit-courier'))
          this.editWizard = true;
      }
    });

  }

  ngOnDestroy(): void {
    this.router_subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.courierForm = this.formBuilder.group({
      courierProvider: ["", Validators.required],
      trackingLink: ["", Validators.required]
    });

    this.actRoute.queryParams.subscribe(params => {
      this.courierModel = JSON.parse(params['courierModel']);
    });
  }


  editProviders(event: any) {
    this.router.navigate(['/edit-courier'], { queryParams: { courierModel: JSON.stringify(event) } });
  }



  get courierCheck(): { [key: string]: AbstractControl } {
    return this.courierForm.controls;
  }

  proceed(): void {
    this.submitted = true;
    if (this.courierForm.invalid) {
      return;
    }
    this.editWizard ? this.editCourier() : this.addNewCourier();

  }

  addNewCourier() {
    this.jsonHttpService.AddNewCourierService(this.courierForm.value).subscribe({
      next: (value: any) => {
        this.refreshTableAndRestForm();
      }
    })
  }

  editCourier() {
    this.jsonHttpService.EditCourierProvider(this.courierModel).subscribe({
      next: (value: any) => {
        this.refreshTableAndRestForm();
        this.navigateRoute('/add-courier');
      }
    })
  }

  refreshTableAndRestForm() {
    this.refreshEvent.next();
    this.submitted = false;
    this.courierForm.reset()
  }

  navigateRoute(data: string) {
    this.router.navigate([data])
  }
}
