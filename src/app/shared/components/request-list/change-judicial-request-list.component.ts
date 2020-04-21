import { RequestResponse } from './../../dto/request-response.model';
import { CorrectionRequestService } from './../../service/correction-request.service';
import {LanguageRequest} from './../../dto/language-request.model';
import {LanguageChangeService} from './../../service/language-change.service';
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {JudicialChange} from '../../dto/judicial-change-model';
import {SnackBarService} from '../../service/snack-bar.service';
import {JudicialService} from '../../service/change-judicial-service';
import {TokenStorageService} from '../../auth/token-storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Workflow} from '../../enum/workflow.enum';
import {SearchRequestService} from '../../service/search-request.service';
import {SearchRequest} from '../../dto/search-request.model';
import {SessionService} from '../../service/session.service';
import {ExtractRequestService} from '../../service/extract-request.service';
import {ExtractRequest} from '../../dto/extract-request.model';
import {ChangeNameService} from '../../service/change-name.service';
import {NotaryNameChangeModel} from '../../dto/notary-name-change.model';
import {ChangeLandRegistryService} from '../../service/change-land-registry.service';
import {ChangeLandRegistryDto} from '../../dto/change-land-registry.dto';
import {SystemService} from '../../service/system.service';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-change-judicial-request-list',
  templateUrl: './change-judicial-request-list.component.html',
  styleUrls: ['./change-judicial-request-list.component.css']
})
export class ChangeJudicialRequestListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns: string[] = ['requestId', 'description', 'workflowDescription', 'date', 'action'];

  public requests: any[] = [];

  dataSource: MatTableDataSource<any>;

  Workflow = Workflow;

  public flag: any;
  public titleText: string;
  public headerText: string;
  public newButtonURL: string;
  public actionButtonURL: string;
  public currentLang: string;

  previousUrl = '';

  constructor(private judicialService: JudicialService,
              private changeNameService: ChangeNameService,
              private searchRequestService: SearchRequestService,
              private extractRequestService: ExtractRequestService,
              private snackBar: SnackBarService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private sessionService: SessionService,
              private tokenStorageService: TokenStorageService,
              private langChangeService: LanguageChangeService,
              private landregistryService: ChangeLandRegistryService,
              private folioCorrectionService: CorrectionRequestService,
              private systemService: SystemService,
              private translate: TranslateService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.activatedRoute.params.subscribe(params => {
      this.flag = atob(params.flag); // (+) converts string 'id' to a number
    });

    this.previousUrl = this.router.url;

    // translate.onLangChange.subscribe((event: LangChangeEvent) => {
    //   this.currentLang = event.lang;
    //   if (this.flag === Workflow.CHANGE_LAND_REGISTRY) {
    //     //alert("methana");
    //     this.loadData();
    //     this.headerText = this.translate.instant('PUBLIC_COMMON.JUD_TITLE1');
    //     this.titleText = this.translate.instant('PUBLIC_COMMON.JUD_TITLE2');
    //   }
    //   else if (this.flag === Workflow.SEARCH_REQUEST) {
    //    // alert("athana" + this.translate.instant('PUBLIC_COMMON.SEARCH_TITLE2'));
    //     this.headerText = this.translate.instant('PUBLIC_COMMON.SEARCH_TITLE1');
    //     this.titleText = this.translate.instant('PUBLIC_COMMON.SEARCH_TITLE2');
    //   }
    //   //this._changeDetectorRef.detectChanges();
    // });
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
    switch (this.flag) {
      case Workflow.JUDICIAL_ZONE_CHANGE:
        this.headerText = this.translate.instant('PUBLIC_COMMON.JUD_TITLE1');
        this.titleText = this.translate.instant('PUBLIC_COMMON.JUD_TITLE2');
        break;
      case Workflow.NOTARY_NAME_CHANGE:
        this.headerText = this.translate.instant('PUBLIC_COMMON.NOT_TITEL1');
        this.titleText = this.translate.instant('PUBLIC_COMMON.NOT_TITLE2');
        break;
      case Workflow.SEARCH_REQUEST:
        this.headerText = this.translate.instant('PUBLIC_COMMON.SEARCH_TITLE1');
        this.titleText = this.translate.instant('PUBLIC_COMMON.SEARCH_TITLE2');
        break;
      case Workflow.EXTRACT_REQUEST:
        this.headerText = this.translate.instant('PUBLIC_COMMON.EXTRACT_TIT1');
        this.titleText = this.translate.instant('PUBLIC_COMMON.EXTRACT_TIT2');
        break;
      case Workflow.LANGUAGE_CHANGE:
        this.headerText = this.translate.instant('PUBLIC_COMMON.LANG1');
        this.titleText = this.translate.instant('PUBLIC_COMMON.LANG2');
        break;
      case Workflow.CHANGE_LAND_REGISTRY:
        this.headerText = this.translate.instant('PUBLIC_COMMON.REGISTRY1');
        this.titleText = this.translate.instant('PUBLIC_COMMON.REGISTRY2');
        break;

      case Workflow.FOLIO_REQUEST_CORRECTION:
        this.headerText = this.translate.instant('PUBLIC_COMMON.SECTION351');
        this.titleText = this.translate.instant('PUBLIC_COMMON.SECTION352');
        break;
    }
    });
    }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    switch (this.flag) {
      case Workflow.JUDICIAL_ZONE_CHANGE:
        this.loadJudicialChangeRequests();
        this.headerText = this.translate.instant('PUBLIC_COMMON.JUD_TITLE1');
        this.titleText = this.translate.instant('PUBLIC_COMMON.JUD_TITLE2');
        this.newButtonURL = '/change-judicial';
        this.actionButtonURL = '/change-judicial-request-view/';
        break;
      case Workflow.NOTARY_NAME_CHANGE:
        this.loadNameChangeRequests();
        this.headerText = this.translate.instant('PUBLIC_COMMON.NOT_TITEL1');
        this.titleText = this.translate.instant('PUBLIC_COMMON.NOT_TITLE2');
        this.newButtonURL = '/change-the-name';
        this.actionButtonURL = `/change-name-request-view/`;
        break;
      case Workflow.SEARCH_REQUEST:
        this.loadSearchRequests();
        this.headerText = this.translate.instant('PUBLIC_COMMON.SEARCH_TITLE1');
        this.titleText = this.translate.instant('PUBLIC_COMMON.SEARCH_TITLE2');
        this.newButtonURL = '/search-document';
        this.actionButtonURL = `/search-document-view/`;
        break;
      case Workflow.EXTRACT_REQUEST:
        this.loadExtractRequests();
        this.headerText = this.translate.instant('PUBLIC_COMMON.SEARCH_TITLE1');
        this.titleText = this.translate.instant('PUBLIC_COMMON.SEARCH_TITLE2');
        this.newButtonURL = '/extract';
        this.actionButtonURL = `/extract-view/`;
        break;
      case Workflow.LANGUAGE_CHANGE:
        this.loadLanguageChangeRequests();
        this.headerText = this.translate.instant('PUBLIC_COMMON.REGISTRY1');
        this.titleText = this.translate.instant('PUBLIC_COMMON.REGISTRY2');
        this.newButtonURL = '/language-change';
        this.actionButtonURL = '/language-change-view/';
        break;
      case Workflow.CHANGE_LAND_REGISTRY:
        this.loadLandRegistryRequests();
        this.headerText = this.translate.instant('PUBLIC_COMMON.JUD_TITLE1');
        this.titleText = this.translate.instant('PUBLIC_COMMON.JUD_TITLE2');
        this.newButtonURL = '/change-registry';
        this.actionButtonURL = '/change-land-registry-view/';
        break;
      // section 35 corrections
      case Workflow.FOLIO_REQUEST_CORRECTION:
        this.getFolioCorrctionRequest();
        this.headerText = this.translate.instant('PUBLIC_COMMON.SECTION351');
        this.titleText = this.translate.instant('PUBLIC_COMMON.SECTION352');
        this.newButtonURL = '/request-for-correction';
        this.actionButtonURL = '/request-for-correction/';
        break;
    }
  }


  getBase64(value: string): string {
    return btoa(value);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadJudicialChangeRequests() {
    this.requests = [];
    this.judicialService.getJudicialChangeRequest(this.sessionService.getUser().id).subscribe(
      (data: JudicialChange[]) => {
        this.requests = data;
        this.dataSource = new MatTableDataSource(this.requests);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        this.snackBar.error('Failed');
      }
    );
  }

  loadSearchRequests() {
    this.requests = [];
    this.searchRequestService.findAllByPublicUser(this.sessionService.getUser().id, this.sessionService.getUser().type).subscribe(
      (data: SearchRequest[]) => {
        this.requests = data;
        this.dataSource = new MatTableDataSource(this.requests);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        this.snackBar.error('Failed');
      }
    );
  }

  loadExtractRequests() {
    this.requests = [];
    this.extractRequestService.findAllByPublicUser(this.sessionService.getUser().id, this.sessionService.getUser().type).subscribe(
      (data: ExtractRequest[]) => {
        this.requests = data;
        this.dataSource = new MatTableDataSource(this.requests);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        this.snackBar.error('Failed');
      }
    );
  }

  loadNameChangeRequests() {
    this.requests = [];
    this.changeNameService.getNameChangeRequest(this.sessionService.getUser().id).subscribe(
      (data: NotaryNameChangeModel[]) => {
        this.requests = data;
        this.dataSource = new MatTableDataSource(this.requests);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        this.snackBar.error('Failed');
      }
    );
  }

  /**
   * Get all language change requests by user
   */
  loadLanguageChangeRequests() {
    this.langChangeService.getLanguageChangeRequests(this.sessionService.getUser().id).subscribe(
      (result: LanguageRequest[]) => {
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        this.snackBar.error('Failed');
      }
    );
  }

  /**
   * Get all land registry requests
   */

  loadLandRegistryRequests() {
    this.landregistryService.getAllRequests(this.sessionService.getUser().id).subscribe(
      (result: ChangeLandRegistryDto[]) => {
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

  }


  getFolioCorrctionRequest() {
    // get requests
    this.folioCorrectionService.getFolioCorrectionRequests(this.sessionService.getUser().id).subscribe(
      (response: RequestResponse) => {
        this.dataSource = new MatTableDataSource(response.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }
}
