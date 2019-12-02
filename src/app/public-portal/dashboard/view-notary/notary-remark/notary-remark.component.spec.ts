import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaryRemarkComponent } from './notary-remark.component';

describe('NotaryRemarkComponent', () => {
  let component: NotaryRemarkComponent;
  let fixture: ComponentFixture<NotaryRemarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotaryRemarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaryRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
