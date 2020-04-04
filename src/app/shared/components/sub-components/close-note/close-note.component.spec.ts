import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseNoteComponent } from './close-note.component';

describe('CloseNoteComponent', () => {
  let component: CloseNoteComponent;
  let fixture: ComponentFixture<CloseNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
