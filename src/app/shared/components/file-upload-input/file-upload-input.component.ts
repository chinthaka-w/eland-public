import {Component, OnInit, ElementRef, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {FormControlName, FormGroup} from '@angular/forms';
import {SystemService} from '../../service/system.service';
import {FileTypes} from '../../enum/file-types.enum';

@Component({
  selector: 'file-upload-input',
  templateUrl: './file-upload-input.component.html',
  styleUrls: ['./file-upload-input.component.css']
})
export class FileUploadInputComponent implements OnInit {

  @Input() invalid: boolean = false;
  @Input() document: any;
  @Output() response = new EventEmitter;

  @ViewChild('fileUpload', {static: false}) myInputVariable: ElementRef;

  files: File[] = [];
  fileUpload: ElementRef;
  imageSrc: string;
  errorMsg;
  isPDF: boolean = false;

  // 20MB in bytes
  maximumFileSize: number = 20971520;

  constructor(private sanitizer: DomSanitizer,
              private systemService: SystemService) {
  }

  ngOnInit() {
    if (this.document && this.document.file) {
      this.files[0] = this.document.file;
      this.imagePreview(this.document.file);
    }
  }

  onFileSelected(event) {
    this.errorMsg = undefined;
    if (this.document) {
      this.document.error = false;
      this.document.errorMsg = '';
    }
    const files = event.dataTransfer
      ? event.dataTransfer.files
      : event.target.files;
    if (files.length == 0) {
      return
    }
    this.files = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      file.objectURL = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(files[i])
      );

      if (files[i].type !== FileTypes.JPEG && files[i].type !== FileTypes.PDF && files[i].type !== FileTypes.PNG) {
        this.errorMsg = this.systemService.getTranslation('VALIDATION.INVALID_FILE_ERR');
        if (this.document) {
          this.document.error = true;
          this.document.errorMsg = this.errorMsg;
        }
        this.myInputVariable.nativeElement.value = '';
        this.invalid = true;
        return
      }

      if (+files[i].size > this.maximumFileSize) {
        this.errorMsg = this.systemService.getTranslation('VALIDATION.MAX_FILE_SIZE_ERR');
        if (this.document) {
          this.document.error = true;
          this.document.errorMsg = this.errorMsg;
        }
        this.myInputVariable.nativeElement.value = '';
        this.invalid = true;
        return
      }

      if (this.document) {
        this.document.file = file;
      }

      this.files.push(files[i]);

      // preview image
      this.imagePreview(file);
    }
    this.response.emit(this.files);
  }

  removeFile(index) {
    this.files.splice(index, 1);
    this.response.emit(this.files);

    // remove image preview
    this.imageSrc = '';
    this.isPDF = false;
    this.myInputVariable.nativeElement.value = null;
  }

  onClick() {
    if (this.fileUpload) {
      this.fileUpload.nativeElement.click();
    }
  }

  imagePreview(file: any) {
    console.log('imagePreview', file);
    this.isPDF = file.type == FileTypes.PDF;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageSrc = reader.result as string;
    };
  }
}
