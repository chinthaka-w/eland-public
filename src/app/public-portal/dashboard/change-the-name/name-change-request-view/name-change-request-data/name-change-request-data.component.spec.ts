import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameChangeRequestDataComponent } from './name-change-request-data.component';

describe('NameChangeRequestDataComponent', () => {
  let component: NameChangeRequestDataComponent;
  let fixture: ComponentFixture<NameChangeRequestDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameChangeRequestDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameChangeRequestDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
