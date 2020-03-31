import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossNoteComponent } from './cross-note.component';

describe('CrossNoteComponent', () => {
  let component: CrossNoteComponent;
  let fixture: ComponentFixture<CrossNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
