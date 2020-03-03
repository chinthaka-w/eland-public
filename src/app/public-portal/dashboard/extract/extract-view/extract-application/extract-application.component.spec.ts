import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractApplicationComponent } from './extract-application.component';

describe('ExtractApplicationComponent', () => {
  let component: ExtractApplicationComponent;
  let fixture: ComponentFixture<ExtractApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtractApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
