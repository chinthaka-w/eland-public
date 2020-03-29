import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLandRegistryComponent } from './change-land-registry.component';

describe('ChangeLandRegistryComponent', () => {
  let component: ChangeLandRegistryComponent;
  let fixture: ComponentFixture<ChangeLandRegistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeLandRegistryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLandRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
