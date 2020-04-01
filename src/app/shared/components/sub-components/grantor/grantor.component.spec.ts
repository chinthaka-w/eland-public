import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrantorComponent } from './grantor.component';

describe('GrantorComponent', () => {
  let component: GrantorComponent;
  let fixture: ComponentFixture<GrantorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrantorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrantorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
