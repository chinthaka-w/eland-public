import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemrkTableComponent } from './remrk-table.component';

describe('RemrkTableComponent', () => {
  let component: RemrkTableComponent;
  let fixture: ComponentFixture<RemrkTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemrkTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemrkTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
