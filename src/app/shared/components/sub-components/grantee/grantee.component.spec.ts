import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GranteeComponent } from './grantee.component';

describe('GranteeComponent', () => {
  let component: GranteeComponent;
  let fixture: ComponentFixture<GranteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GranteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GranteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
