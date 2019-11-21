import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaryDetailsComponent } from './notary-details.component';

describe('NotaryDetailsComponent', () => {
  let component: NotaryDetailsComponent;
  let fixture: ComponentFixture<NotaryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotaryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
