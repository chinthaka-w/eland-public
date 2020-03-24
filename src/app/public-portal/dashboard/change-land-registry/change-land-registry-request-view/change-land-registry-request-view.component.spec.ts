import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLandRegistryRequestViewComponent } from './change-land-registry-request-view.component';

describe('ChangeLandRegistryRequestViewComponent', () => {
  let component: ChangeLandRegistryRequestViewComponent;
  let fixture: ComponentFixture<ChangeLandRegistryRequestViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeLandRegistryRequestViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLandRegistryRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
