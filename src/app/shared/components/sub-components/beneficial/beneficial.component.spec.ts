import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficialComponent } from './beneficial.component';

describe('BeneficialComponent', () => {
  let component: BeneficialComponent;
  let fixture: ComponentFixture<BeneficialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
