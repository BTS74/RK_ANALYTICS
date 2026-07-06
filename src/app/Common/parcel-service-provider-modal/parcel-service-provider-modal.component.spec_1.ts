import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelServiceProviderModalComponent } from './parcel-service-provider-modal.component';

describe('ParcelServiceProviderModalComponent', () => {
  let component: ParcelServiceProviderModalComponent;
  let fixture: ComponentFixture<ParcelServiceProviderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcelServiceProviderModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelServiceProviderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
