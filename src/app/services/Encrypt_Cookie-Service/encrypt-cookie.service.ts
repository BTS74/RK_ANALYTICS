import { Injectable } from '@angular/core';
import { NgxEncryptCookieService } from 'ngx-encrypt-cookie';

@Injectable({
  providedIn: 'root'
})
export class EncryptCookieService {

  constructor(private cookie: NgxEncryptCookieService) {
    if (!this.cookie.check("cookie")) {
      this.generatePrivateKey();
    }
  }

  generatePrivateKey() {
    this.cookie.set("cookie", this.cookie.generateKey("512/32", "#ammsa@1230"), false);
  }

  getPrivateKey() {
    return this.cookie.get("cookie", false);
  }

}

