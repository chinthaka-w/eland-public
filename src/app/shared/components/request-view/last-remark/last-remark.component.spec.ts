import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastRemarkComponent } from './last-remark.component';

describe('LastRemarkComponent', () => {
  let component: LastRemarkComponent;
  let fixture: ComponentFixture<LastRemarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastRemarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
