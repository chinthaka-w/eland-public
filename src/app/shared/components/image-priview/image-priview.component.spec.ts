import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePriviewComponent } from './image-priview.component';

describe('ImagePriviewComponent', () => {
  let component: ImagePriviewComponent;
  let fixture: ComponentFixture<ImagePriviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagePriviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagePriviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
