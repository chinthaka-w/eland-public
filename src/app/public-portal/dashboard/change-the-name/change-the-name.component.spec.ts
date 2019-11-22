import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTheNameComponent } from './change-the-name.component';

describe('ChangeTheNameComponent', () => {
  let component: ChangeTheNameComponent;
  let fixture: ComponentFixture<ChangeTheNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeTheNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeTheNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
