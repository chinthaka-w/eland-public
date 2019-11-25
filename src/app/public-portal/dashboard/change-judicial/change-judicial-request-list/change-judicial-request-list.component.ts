import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {JudicialChange} from '../../../../shared/dto/judicial-change-model';
import {SnackBarService} from '../../../../shared/service/snack-bar.service';
import {JudicialService} from '../../../../shared/service/change-judicial-service';
import {TokenStorageService} from '../../../../shared/auth/token-storage.service';
import {RequestViewComponent} from '../../requests/request-view/request-view.component';

@Component({
  selector: 'app-change-judicial-request-list',
  templateUrl: './change-judicial-request-list.component.html',
  styleUrls: ['./change-judicial-request-list.component.css']
})
export class ChangeJudicialRequestListComponent implements OnInit {
   displayedColumns: string[] = ['notaryRequestID', 'judicialZoneId', 'workflowDescription', 'date', 'action'];
   public judicals: JudicialChange[] = [];
   dataSource: MatTableDataSource<any>;
   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
   @ViewChild(MatSort, {static: true}) sort: MatSort;
   public loginNotaryID: number;

  constructor(private judicialService: JudicialService, private snackBar: SnackBarService, private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    this.loginNotaryID = 1;
    this.loadData();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadData() {
    this.judicals = [];
    this.judicialService.getJudicialChangeRequest(this.loginNotaryID).subscribe(
      (data: JudicialChange[]) => {
        this.judicals = data;
        this.dataSource = new MatTableDataSource(this.judicals);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        this.snackBar.error('Failed');
      }
    );
  }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(RequestViewComponent, {
  //     width: '800px'
  //   });
  //
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }


}
