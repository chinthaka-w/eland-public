import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsGnDivisionTableComponent } from './ds-gn-division-table.component';

describe('DsGnDivisionTableComponent', () => {
  let component: DsGnDivisionTableComponent;
  let fixture: ComponentFixture<DsGnDivisionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsGnDivisionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsGnDivisionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
