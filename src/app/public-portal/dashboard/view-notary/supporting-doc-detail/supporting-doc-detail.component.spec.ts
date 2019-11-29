import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportingDocDetailComponent } from './supporting-doc-detail.component';

describe('SupportingDocDetailComponent', () => {
  let component: SupportingDocDetailComponent;
  let fixture: ComponentFixture<SupportingDocDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportingDocDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportingDocDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
