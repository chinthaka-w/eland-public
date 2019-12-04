import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractViewComponent } from './extract-view.component';

describe('ExtractViewComponent', () => {
  let component: ExtractViewComponent;
  let fixture: ComponentFixture<ExtractViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtractViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
