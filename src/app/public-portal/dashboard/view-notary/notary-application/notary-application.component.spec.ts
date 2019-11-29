import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaryApplicationComponent } from './notary-application.component';

describe('NotaryApplicationComponent', () => {
  let component: NotaryApplicationComponent;
  let fixture: ComponentFixture<NotaryApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotaryApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotaryApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
