import { SystemService } from 'src/app/shared/service/system.service';
import { SnackBarService } from 'src/app/shared/service/snack-bar.service';
import { RequestResponse } from './../../dto/request-response.model';
import { FileMeta } from './../../dto/file-meta.model';
import { FileModel } from './../../dto/file.dto';
import { FileUploadPopupService } from './../../service/file-upload-popup.service';
import { DocumentDTO } from './../../dto/document-dto';
import { DocServiceService } from './../../service/doc-service.service';
import { DocMetaKey } from './../../dto/doc-meta-key.model';
import { Component, OnInit, Input } from '@angular/core';
import { WorkflowStageDocTypeDTO } from '../../dto/workflow-stage-doc-type-dto';

@Component({
  selector: 'app-doc-preview',
  templateUrl: './doc-preview.component.html',
  styleUrls: ['./doc-preview.component.css']
})
export class DocPreviewComponent implements OnInit {
  @Input() docMetaKeys: DocMetaKey[];
  @Input() docUploadWorkflowStage: string;
  @Input() isEdit = false;
  docData: DocumentDTO[];
  workflowDocuments: WorkflowStageDocTypeDTO[] = [];
  uploadedDocs: FileMeta[] = [];
  isDocUpdating = false;

  constructor(private docservice: DocServiceService,
              private fileUploadService: FileUploadPopupService,
              private snackBarService: SnackBarService,
              private systemService: SystemService) { }

  ngOnInit() {
    this.getDocsByDocMeta(this.docMetaKeys);

    // get workflow documents
    if (this.isEdit) {
      this.getWorkflowStageDocs(this.docUploadWorkflowStage);
    }
  }

  getDocsByDocMeta(docMetaKeys: DocMetaKey[]) {
    this.docservice.getDocsByMeta(docMetaKeys).subscribe(
      (response: DocumentDTO[]) => {
        this.docData = response;
      }
    );
  }

  getWorkflowStageDocs(workflowStageCode: string) {
    this.fileUploadService.getWorkflowStageDocuments(workflowStageCode).subscribe(
      (response: WorkflowStageDocTypeDTO[]) => {
        this.workflowDocuments = response;
      }
    );
  }

  setFiles(files: File[], docType: number, status: boolean) {

    if (files.length > 0) {
      const fileModel = new FileModel(null, files[0].type === 'application/pdf' ? 2 : 1);
      fileModel.fileName = files[0].name;
      fileModel.isMandatory = status;
      this.convertFileToBase64(files[0], fileModel);

      const fileMeta = new FileMeta();
      fileMeta.file = fileModel;
      fileMeta.docTypeId = docType;
      fileMeta.metaData = this.docMetaKeys[0];

      this.uploadedDocs.push(fileMeta);
    } else { // on file remove
      this.uploadedDocs.forEach((doc, index) => {
        if (doc.docTypeId === docType) {
          this.uploadedDocs.splice(index, 1);
        }
      });
    }
  }

  /**
   * convert file to base 64
   */
  convertFileToBase64(file: File, fileModel: FileModel): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      fileModel.base64 = reader.result.toString();
    };
  }

  onDocsUpdate() {
    if (this.uploadedDocs.length > 0) {
      this.fileUploadService.updateAlreadyUploadedDocs(this.uploadedDocs).subscribe(
        (response: RequestResponse) => {
          this.snackBarService.success(this.systemService.getTranslation('ALERT.MESSAGE.UPDATE_SUCCESS'));
        },
        () => {
          this.snackBarService.error(this.systemService.getTranslation('ALERT.WARNING.INTERNAL_SERVER_ERROR'));
        },
        () => {
          this.isDocUpdating = false;
          this.getDocsByDocMeta(this.docMetaKeys);
        }
      );
    } else {
      this.snackBarService.warn(this.systemService.getTranslation('ALERT.MESSAGE.UPLOAD_DOCS'));
    }
  }

}
