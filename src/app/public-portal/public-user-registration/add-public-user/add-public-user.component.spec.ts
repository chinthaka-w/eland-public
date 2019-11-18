import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPublicUserComponent } from './add-public-user.component';

describe('AddPublicUserComponent', () => {
  let component: AddPublicUserComponent;
  let fixture: ComponentFixture<AddPublicUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPublicUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPublicUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
