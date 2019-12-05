import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenApplicationComponent } from './citizen-application.component';

describe('CitizenApplicationComponent', () => {
  let component: CitizenApplicationComponent;
  let fixture: ComponentFixture<CitizenApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitizenApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitizenApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
