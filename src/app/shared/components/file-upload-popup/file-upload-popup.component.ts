import { SystemService } from './../../service/system.service';
import { SnackBarService } from './../../service/snack-bar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SessionService } from './../../service/session.service';
import { TokenStorageService } from './../../auth/token-storage.service';
import { FileModel } from './../../dto/file.dto';
import { FileMeta } from './../../dto/file-meta.model';
import { WorkflowStageDocTypeDTO } from './../../dto/workflow-stage-doc-type-dto';
import { FileUploadPopupService } from './../../service/file-upload-popup.service';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-file-upload-popup',
  templateUrl: './file-upload-popup.component.html',
  styleUrls: ['./file-upload-popup.component.css']
})
export class FileUploadPopupComponent implements OnInit {
  @Input()
  docType: string;
  workflowDocuments: WorkflowStageDocTypeDTO[] = [];
  filesMeta: FileMeta[] = [];
  isWorkflowDocsLoaded = false;

  constructor(@Inject(MAT_DIALOG_DATA) public workflowStage: string,
              private fileUploadPopupService: FileUploadPopupService,
              private tokenStorageService: SessionService,
              public dialogRef: MatDialogRef<FileMeta[]>,
              private snackBarService: SnackBarService,
              private systemService: SystemService) { }

  ngOnInit() {
    this.getWorkflowDocuments(this.workflowStage);
  }

  uploadResponse(files: File[], docTypeId: number, isMandatory: boolean): void {
    // add documents
    if (files.length > 0) {
      const file = new FileModel(null, files[0].type === 'application/pdf' ? 2 : 1);
      file.fileName = files[0].name;
      file.isMandatory = isMandatory;

      this.convertFileToBase64(files[0], file);
      const fileMeta = new FileMeta();
      fileMeta.file = file;
      fileMeta.docTypeId = docTypeId;

      this.filesMeta.push(fileMeta);
    } else {
      // remove doctype from list
      this.filesMeta.forEach((doc, index) => {
        if (doc.docTypeId === docTypeId) {
          this.filesMeta.splice(index, 1);
        }
      });
    }

  }

  getWorkflowDocuments(workflowStage: string): void {
    this.fileUploadPopupService.getWorkflowStageDocuments(workflowStage).subscribe(
      (documents: WorkflowStageDocTypeDTO[]) => {
        this.workflowDocuments = documents;
      },
      () => {
        this.snackBarService.error(this.systemService.getTranslation(''));
      },
      () => {
        this.isWorkflowDocsLoaded = true;
      }
    );
  }

  onUploadDocuments(): void {
    // check mandatory documents upload
    let workflowMandatoryDocCount = 0;
    let uploadedMandatoryDocCount = 0;

    this.workflowDocuments.forEach((doc, index) => {
      if  (doc.required) {
        workflowMandatoryDocCount += 1;
      }
    });

    this.filesMeta.forEach((doc, index) => {
      if (doc.file.isMandatory) {
        uploadedMandatoryDocCount += 1;
      }
    });

    if (workflowMandatoryDocCount === uploadedMandatoryDocCount) {
      this.dialogRef.close(this.filesMeta);
    } else {
      this.snackBarService.warn(this.systemService.getTranslation('ALERT.TITLE.MANDATORY_DOC_ERR'));
    }
  }

  convertFileToBase64(file: File, fileModel: FileModel): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      fileModel.base64 = reader.result.toString();
    };
  }

}
