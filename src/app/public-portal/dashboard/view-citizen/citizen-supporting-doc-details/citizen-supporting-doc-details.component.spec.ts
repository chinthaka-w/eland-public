import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenSupportingDocDetailsComponent } from './citizen-supporting-doc-details.component';

describe('CitizenSupportingDocDetailsComponent', () => {
  let component: CitizenSupportingDocDetailsComponent;
  let fixture: ComponentFixture<CitizenSupportingDocDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitizenSupportingDocDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitizenSupportingDocDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
