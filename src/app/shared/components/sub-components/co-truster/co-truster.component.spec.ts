import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoTrusterComponent } from './co-truster.component';

describe('CoTrusterComponent', () => {
  let component: CoTrusterComponent;
  let fixture: ComponentFixture<CoTrusterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoTrusterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoTrusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
