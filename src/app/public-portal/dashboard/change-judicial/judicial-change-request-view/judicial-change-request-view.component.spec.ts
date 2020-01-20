import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JudicialChangeRequestViewComponent } from './judicial-change-request-view.component';

describe('JudicialChangeRequestViewComponent', () => {
  let component: JudicialChangeRequestViewComponent;
  let fixture: ComponentFixture<JudicialChangeRequestViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JudicialChangeRequestViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JudicialChangeRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
