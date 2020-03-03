import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenPaymentInfoComponent } from './citizen-payment-info.component';

describe('CitizenPaymentInfoComponent', () => {
  let component: CitizenPaymentInfoComponent;
  let fixture: ComponentFixture<CitizenPaymentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitizenPaymentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitizenPaymentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
