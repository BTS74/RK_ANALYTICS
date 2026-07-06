import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {Subscription,Observable} from 'rxjs';
import {JsonHttpService} from '../../services/Json-Http/json-http.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  public Alert:any=[];
  @Input() alertEvents: Observable<void> | undefined;
  constructor(private toastr: ToastrService,private JsonHttpService:JsonHttpService) {
    this.JsonHttpService.triggerToastMessage().subscribe((message:any) => {
      this.Alert=message;
      message.type=='success' ? this.openSuccess() : this.openError();  
   });
   }

  ngOnInit(): void {

  }


  openSuccess()
{

    this.toastr.success(this.Alert.title,this.Alert.message, {
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-right",  
        timeOut: 5000,
        extendedTimeOut: 1000,
});
}



openError(){
  this.toastr.warning(this.Alert.title,this.Alert.message, {
  newestOnTop: false,
  progressBar: true,
  positionClass: "toast-top-right",  
  timeOut: 5000,
  extendedTimeOut: 1000,
});
}

}
