import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDocumentResultComponent } from './search-document-result.component';

describe('SearchDocumentResultComponent', () => {
  let component: SearchDocumentResultComponent;
  let fixture: ComponentFixture<SearchDocumentResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDocumentResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDocumentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
