import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicUserRegistrationComponent } from './public-user-registration.component';

describe('PublicUserRegistrationComponent', () => {
  let component: PublicUserRegistrationComponent;
  let fixture: ComponentFixture<PublicUserRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicUserRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicUserRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
