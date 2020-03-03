import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDocumentApplicationComponent } from './search-document-application.component';

describe('SearchDocumentApplicationComponent', () => {
  let component: SearchDocumentApplicationComponent;
  let fixture: ComponentFixture<SearchDocumentApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchDocumentApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchDocumentApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
