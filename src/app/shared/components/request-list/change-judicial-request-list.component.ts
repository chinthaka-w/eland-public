import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {JudicialChange} from '../../dto/judicial-change-model';
import {SnackBarService} from '../../service/snack-bar.service';
import {JudicialService} from '../../service/change-judicial-service';
import {TokenStorageService} from '../../auth/token-storage.service';
import {RequestViewComponent} from '../../../public-portal/dashboard/requests/request-view/request-view.component';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {Workflow} from '../../enum/workflow.enum';
import {SearchRequestService} from '../../service/search-request.service';
import {SearchRequest} from '../../dto/search-request.model';
import {map} from 'rxjs/operators';
import {SessionService} from '../../service/session.service';
import {ExtractRequestService} from '../../service/extract-request.service';
import {ExtractRequest} from '../../dto/extract-request.model';
import {ChangeNameService} from "../../service/change-name.service";
import {NotaryNameChangeModel} from "../../dto/notary-name-change.model";

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

  constructor(private judicialService: JudicialService,
              private changeNameService: ChangeNameService,
              private searchRequestService: SearchRequestService,
              private extractRequestService: ExtractRequestService,
              private snackBar: SnackBarService,
              private activatedRoute: ActivatedRoute,
              private sessionService: SessionService,
              private tokenStorageService: TokenStorageService) {
    this.activatedRoute.params.subscribe(params => {
      this.flag = atob(params['flag']); // (+) converts string 'id' to a number
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    switch (this.flag) {
      case Workflow.JUDICIAL_ZONE_CHANGE:
        this.loadJudicialChangeRequests();
        this.headerText = 'JUDICIAL ZONE CHANGING';
        this.titleText = 'REQUEST FOR CHANGING THE JUDICIAL ZONE';
        this.newButtonURL = '/change-judicial';
        this.actionButtonURL = `/change-judicial-request-view/${btoa(Workflow.JUDICIAL_ZONE_CHANGE)}/`;
        break;
      case Workflow.NOTARY_NAME_CHANGE:
        this.loadNameChangeRequests();
        this.headerText = 'NOTARY NAME CHANGING';
        this.titleText = 'REQUEST FOR CHANGING THE NOTARY NAME';
        this.newButtonURL = '/change-the-name';
        this.actionButtonURL = `/change-name-request-view/`;
        break;
      case Workflow.SEARCH_REQUEST:
        this.loadSearchRequests();
        this.headerText = 'FOLIO / DEED SEARCH';
        this.titleText = 'REQUEST FOR SEARCH DOCUMENT';
        this.newButtonURL = '/search-document';
        this.actionButtonURL = `/search-document-view/`;
        break;
      case Workflow.EXTRACT_REQUEST:
        this.loadExtractRequests();
        this.headerText = 'FOLIO / DEED EXTRACT';
        this.titleText = 'REQUEST FOR EXTRACT DOCUMENT';
        this.newButtonURL = '/extract';
        this.actionButtonURL = `/extract-view/`;
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


}
