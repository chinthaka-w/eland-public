import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaryClerkComponent } from './notary-clerk.component';

describe('NotaryClerkComponent', () => {
  let component: NotaryClerkComponent;
  let fixture: ComponentFixture<NotaryClerkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotaryClerkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaryClerkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
