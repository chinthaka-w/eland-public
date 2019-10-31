import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotaryComponent } from './add-notary.component';

describe('AddNotaryComponent', () => {
  let component: AddNotaryComponent;
  let fixture: ComponentFixture<AddNotaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNotaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNotaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
