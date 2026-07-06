import { HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sha256, sha224 } from 'js-sha256';
import { JsonHttpService } from '../Json-Http/json-http.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  username = this.JsonHttpService.username;
  password = this.JsonHttpService.password;

  body = "Rk_PatTarAi_GarDeN_GarDeN_ishWARyaNa_gAr_chRoooMpetaIIII_009";
  key = "Rk_PatTarAi_Rk_Rk_PatTarAiGarDeN_chrOmPet_Rk_PatTarAi_eNcoDing";

  constructor(private JsonHttpService: JsonHttpService) { }
  intercept(req: any, next: any) {
    if (req.body == null) {
      this.body = sha256.hmac(this.key, 'Rk_PatTarAi_GarDeN_GarDeN_ishWARyaNa_gAr_chRoooMpetaIIII_009')
    } else {
      this.body = sha256.hmac(this.key, JSON.stringify(req.body))
    }

    let tokenizedreq = req.clone({
      setHeaders: {
        "Authorization": "Basic " + btoa(this.username + ":" + this.password),
        "secret-key": this.body
      }
    })
    return next.handle(tokenizedreq)
  }
}


