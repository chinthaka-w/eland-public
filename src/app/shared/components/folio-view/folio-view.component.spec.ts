import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioViewComponent } from './folio-view.component';

describe('FolioViewComponent', () => {
  let component: FolioViewComponent;
  let fixture: ComponentFixture<FolioViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolioViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolioViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
