import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarkHistoryComponent } from './remark-history.component';

describe('RemarkHistoryComponent', () => {
  let component: RemarkHistoryComponent;
  let fixture: ComponentFixture<RemarkHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemarkHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemarkHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
