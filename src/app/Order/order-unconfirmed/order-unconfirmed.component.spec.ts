import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderUnconfirmedComponent } from './order-unconfirmed.component';

describe('OrderUnconfirmedComponent', () => {
  let component: OrderUnconfirmedComponent;
  let fixture: ComponentFixture<OrderUnconfirmedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderUnconfirmedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderUnconfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
