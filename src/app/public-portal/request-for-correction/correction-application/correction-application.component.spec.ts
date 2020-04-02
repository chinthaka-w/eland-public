import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectionApplicationComponent } from './correction-application.component';

describe('CorrectionApplicationComponent', () => {
  let component: CorrectionApplicationComponent;
  let fixture: ComponentFixture<CorrectionApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrectionApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectionApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
