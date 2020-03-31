import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrusterComponent } from './truster.component';

describe('TrusterComponent', () => {
  let component: TrusterComponent;
  let fixture: ComponentFixture<TrusterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrusterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
