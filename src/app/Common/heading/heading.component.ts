import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.css']
})
export class HeadingComponent implements OnInit {

  constructor() { }

  @Input() heading: string = 'Heading'
  @Input() style: any = {};

  ngOnInit(): void {
  }

}
