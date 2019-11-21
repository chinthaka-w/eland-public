import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicProfileEditComponent } from './public-profile-edit.component';

describe('PublicProfileEditComponent', () => {
  let component: PublicProfileEditComponent;
  let fixture: ComponentFixture<PublicProfileEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicProfileEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
