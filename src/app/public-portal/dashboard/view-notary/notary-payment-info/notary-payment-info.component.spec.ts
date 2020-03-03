import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaryPaymentInfoComponent } from './notary-payment-info.component';

describe('NotaryPaymentInfoComponent', () => {
  let component: NotaryPaymentInfoComponent;
  let fixture: ComponentFixture<NotaryPaymentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotaryPaymentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaryPaymentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
