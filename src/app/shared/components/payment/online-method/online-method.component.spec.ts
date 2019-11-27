import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineMethodComponent } from './online-method.component';

describe('OnlineMethodComponent', () => {
  let component: OnlineMethodComponent;
  let fixture: ComponentFixture<OnlineMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
