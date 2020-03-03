import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeJudicialRequestListComponent } from './change-judicial-request-list.component';

describe('ChangeJudicialRequestListComponent', () => {
  let component: ChangeJudicialRequestListComponent;
  let fixture: ComponentFixture<ChangeJudicialRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeJudicialRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeJudicialRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
