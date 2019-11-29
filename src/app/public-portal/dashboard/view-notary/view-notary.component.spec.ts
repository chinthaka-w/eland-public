import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNotaryComponent } from './view-notary.component';

describe('ViewNotaryComponent', () => {
  let component: ViewNotaryComponent;
  let fixture: ComponentFixture<ViewNotaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewNotaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNotaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
