import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoTrusteeComponent } from './co-trustee.component';

describe('CoTrusteeComponent', () => {
  let component: CoTrusteeComponent;
  let fixture: ComponentFixture<CoTrusteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoTrusteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoTrusteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
