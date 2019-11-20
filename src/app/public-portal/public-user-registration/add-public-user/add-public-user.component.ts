import { Component, OnInit, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-add-public-user",
  templateUrl: "./add-public-user.component.html",
  styleUrls: ["./add-public-user.component.css"]
})
export class AddPublicUserComponent implements OnInit {
  public publicUserForm: FormGroup;
  files: File[] = [];
  fileList = {};
  fileUpload: ElementRef;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.publicUserForm = new FormGroup({
      nearestLr: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      name: new FormControl("", [Validators.required]),
      address1: new FormControl("", [Validators.required]),
      address2: new FormControl("", [Validators.required]),
      address3: new FormControl("", [Validators.required]),
      nic: new FormControl("", [Validators.required]),
      primaryContact: new FormControl("", [Validators.required]),
      secondaryContact: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      reason: new FormControl("", [Validators.required]),
      renewalCertificate: new FormControl("", [Validators.required]),
      nicCopy: new FormControl("", [Validators.required]),
      signatureAndSeal: new FormControl("", [Validators.required]),
      recaptcha: new FormControl(null, Validators.required)
    });
  }

  onFileSelected(event, fileType) {
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
    this.fileList[fileType] = this.files;
    this.files = [];
  }

  removeFile(fileType, index) {
    this.fileList[fileType].splice(index, 1);
  }

  onClick(event) {
    if (this.fileUpload) {
      this.fileUpload.nativeElement.click();
    }
  }
}
