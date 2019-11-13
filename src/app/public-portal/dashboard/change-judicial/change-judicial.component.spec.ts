import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeJudicialComponent } from './change-judicial.component';

describe('ChangeJudicialComponent', () => {
  let component: ChangeJudicialComponent;
  let fixture: ComponentFixture<ChangeJudicialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeJudicialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeJudicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
