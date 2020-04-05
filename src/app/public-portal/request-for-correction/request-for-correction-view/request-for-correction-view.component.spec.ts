import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForCorrectionViewComponent } from './request-for-correction-view.component';

describe('RequestForCorrectionViewComponent', () => {
  let component: RequestForCorrectionViewComponent;
  let fixture: ComponentFixture<RequestForCorrectionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestForCorrectionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestForCorrectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
