import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { JsonHttpService } from '../services/Json-Http/json-http.service';
import { EncryptCookieService } from 'src/app/services/Encrypt_Cookie-Service/encrypt-cookie.service';
import { NgxEncryptCookieService } from 'ngx-encrypt-cookie';

interface UserDetails {
  userName: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public submitted = false;
  public loginDetails = {} as UserDetails;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private jsonHttpService: JsonHttpService,
    private cookieService: CookieService,
    private encryptCookieService: EncryptCookieService,
    private cookie: NgxEncryptCookieService) { }

  // ngOnInit(): void {
  //   this.loginForm = this.formBuilder.group({
  //     userName: ['', Validators.required],
  //     password: ['', Validators.required],
  //   });

    ngOnInit(): void {
      this.initializeForm();
      this.encryptCookieService.generatePrivateKey();
      this.checkLoginStatus();
    }

    private initializeForm(): void {
      this.loginForm = this.formBuilder.group({
        userName: ['', Validators.required],
        password: ['', Validators.required],
      });
    }

    private checkLoginStatus(): void {
      if (this.cookie.check('loggedIn_1231')) {
        this.router.navigate(['/home']);
      }
    }
  

  get loginFormCheck(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  public validateForm(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    if (this.isValidUser(this.loginDetails)) {
      this.router.navigate(['/home']);
      this.cookie.set("loggedIn_1231", 'trueProceed', true, this.encryptCookieService.getPrivateKey(), undefined, '/');
    } else {
      this.jsonHttpService.sendToastMessage('Invalid User name or Password', '', 'failure');
    }
  }

  private isValidUser(details: UserDetails): boolean {
    // return true;
    return details.userName === 'admin1@rkpattarai.com' && details.password === 'rkPattaraiGarden$$$$7492';
  }

  // validateForm() {
  //   // this.router.navigate(['/home']);
  //   // this.cookie.set("loggedIn_1231", 'trueProceed', true, this.EncryptCookieService.getPrivateKey());
  //   this.submitted = true;
  //   if (this.loginForm.invalid) {
  //     return;
  //   }

  //   if (this.loginDetails.userName == 'admin@rkpattarai.com' && this.loginDetails.password == '#rkpattaraiGarden@7492') {
  //     this.router.navigate(['/home']);
  //     this.cookie.set("loggedIn_1231", 'trueProceed', true, this.encryptCookieService.getPrivateKey(), undefined, '/');
  //   } else {
  //     this.jsonHttpService.sendToastMessage('Invalid User name or Password', "", "failure");
  //   }

  // }



}
