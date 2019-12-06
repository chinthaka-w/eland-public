import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenRemarkComponent } from './citizen-remark.component';

describe('CitizenRemarkComponent', () => {
  let component: CitizenRemarkComponent;
  let fixture: ComponentFixture<CitizenRemarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitizenRemarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitizenRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
