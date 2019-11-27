import { Component, OnInit, ElementRef, Output, EventEmitter } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "file-upload-input",
  templateUrl: "./file-upload-input.component.html",
  styleUrls: ["./file-upload-input.component.css"]
})
export class FileUploadInputComponent implements OnInit {

  @Output()
  response = new EventEmitter;
  files: File[] = [];
  fileUpload: ElementRef;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {}

  onFileSelected(event) {
    // console.log('files: ',event.target.files);
    this.files = [];
    const files = event.dataTransfer
      ? event.dataTransfer.files
      : event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      file.objectURL = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(files[i])
      );
      this.files.push(files[i]);
    }
    this.response.emit(this.files);
  }

  removeFile(index) {
    this.files.splice(index, 1);
    this.response.emit(this.files);
  }

  onClick() {
    if (this.fileUpload) {
      this.fileUpload.nativeElement.click();
    }
  }
}
