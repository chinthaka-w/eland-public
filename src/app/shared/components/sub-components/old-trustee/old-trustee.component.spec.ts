import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OldTrusteeComponent } from './old-trustee.component';

describe('OldTrusteeComponent', () => {
  let component: OldTrusteeComponent;
  let fixture: ComponentFixture<OldTrusteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OldTrusteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OldTrusteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
