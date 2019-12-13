import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForCorrectionComponent } from './request-for-correction.component';

describe('RequestForCorrectionComponent', () => {
  let component: RequestForCorrectionComponent;
  let fixture: ComponentFixture<RequestForCorrectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestForCorrectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestForCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
