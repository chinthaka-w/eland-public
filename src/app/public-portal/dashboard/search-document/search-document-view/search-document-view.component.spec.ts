import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDocumentViewComponent } from './search-document-view.component';

describe('SearchDocumentViewComponent', () => {
  let component: SearchDocumentViewComponent;
  let fixture: ComponentFixture<SearchDocumentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDocumentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
