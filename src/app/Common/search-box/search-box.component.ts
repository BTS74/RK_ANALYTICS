import { OnDestroy } from '@angular/core';
import { AfterViewChecked, AfterViewInit, Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JsonHttpService } from '../../services/Json-Http/json-http.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  @Input() placeHolder: string | undefined;
  public form!: FormGroup;
  @Input() searchValue: string | undefined;
  @Output() onSearchValue = new EventEmitter();
    @Output() onClick = new EventEmitter();
  param_subscripton: any;
  constructor(private formBuilder: FormBuilder,
    private jsonHttpService: JsonHttpService, private actRoute: ActivatedRoute) { }


  ngOnDestroy(): void {
    // this.param_subscripton.unsubscribe();
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      search: ['']
    });

    // this.param_subscripton = this.actRoute.queryParams.subscribe((params: any) => {
    //   this.searchValue = params.search_text ? params.search_text : ''; 
    // });
  }

  search() {

    if (this.searchValue?.trim()) {
      this.jsonHttpService.sendSearchValue(this.searchValue);
      this.onSearchValue.emit(this.searchValue);
    } else {
      this.jsonHttpService.sendSearchValue('');
      this.onSearchValue.emit(this.searchValue);
    }
  }


  checkEmptySearch() {
    if (this.searchValue == '') {
      this.jsonHttpService.sendSearchValue('');
      this.onSearchValue.emit(this.searchValue);
    }
  }

  onInputClick(){
    this.onClick.emit();
  }
}
