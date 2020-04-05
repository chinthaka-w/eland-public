import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCorrectionRequestComponent } from './new-correction-request.component';

describe('NewCorrectionRequestComponent', () => {
  let component: NewCorrectionRequestComponent;
  let fixture: ComponentFixture<NewCorrectionRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCorrectionRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCorrectionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
