import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from '../../services/Loader-Service/loader.service';
@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.css']
})
export class PageLoaderComponent implements OnInit {

  constructor(private loaderService: LoaderService) {}
  isLoading: Subject<boolean> = this.loaderService.isLoading;

  ngOnInit(): void {
  }

}
