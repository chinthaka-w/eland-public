import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameChangeRequestViewComponent } from './name-change-request-view.component';

describe('NameChangeRequestViewComponent', () => {
  let component: NameChangeRequestViewComponent;
  let fixture: ComponentFixture<NameChangeRequestViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NameChangeRequestViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameChangeRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
