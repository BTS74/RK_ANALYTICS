import { Component, OnInit, PLATFORM_ID, ChangeDetectorRef, inject, Input, OnChanges, AfterViewChecked } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnChanges, AfterViewChecked {

  @Input() type: string = 'bar';
  @Input() data: any;
  @Input() options: any;

  platformId = inject(PLATFORM_ID);

  constructor(private cd: ChangeDetectorRef) { }

  ngAfterViewChecked() {
    // this.cd.detectChanges();
    this.cd.markForCheck() // Manually trigger change detection
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId))
      this.initChart();
  }

  ngOnChanges() {
    if (this.type && this.data && this.options)
      this.initChart();
  }


  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      this.cd.markForCheck()
    }
  }
}
