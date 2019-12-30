import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LangChangeApplicationComponent } from './lang-change-application.component';

describe('LangChangeApplicationComponent', () => {
  let component: LangChangeApplicationComponent;
  let fixture: ComponentFixture<LangChangeApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LangChangeApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LangChangeApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
